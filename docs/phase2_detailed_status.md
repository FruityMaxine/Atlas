# Phase 2 深度详解：声明式框架与后端核心
> **最后更新时间**: 2026-01-23
> **当前状态**: ✅ Step 1 已完成 | 🚀 准备进入 Step 2

本文档是对 Phase 2 (Atlas 的核心构建阶段) 的超详细拆解。我们要造的不仅仅是一个软件，而是一个**“能运行代码的低代码平台”**。

---

## 🟢 Step 1: Rust 后端引擎 (The Engine)
**状态**: ✅ [已完成 / Completed]
**位置**: `src-tauri/`

这一步的目标是构建 Atlas 的“动力核心”。就像汽车的 V8 引擎，用户看不见它，但没有它车就动不了。

### 1.1 基础设施搭建 (Infrastructure)
*   **[x] Rust 环境标准化**:
    *   升级 Rust 到 **1.82.0 (Stable)**，确保支持 2024 年以后的新语法。
    *   配置 `.cargo/config.toml` 使用 **rsproxy.cn** 镜像，彻底解决中国区网络依赖下载失败的问题。
    *   修复 `Cargo.toml` 中的 `feature` 标志冲突 (`api-all`), 确保 Tauri 能够编译通过。
*   **[x] 项目结构重构**:
    *   **清理**: 删除了 Tauri 默认生成的模板代码。
    *   **分层**: 建立了 `core/` (核心逻辑), `models/` (数据结构), `commands/` (接口) 三层架构，拒绝“一锅炖”的面条代码。

### 1.2 核心模块实现 (Core Implementation)
*   **[x] ProcessManager (进程大管家)**:
    *   **功能**: 这是 Atlas 最复杂的逻辑。它负责在后台启动 Python/Java 脚本。
    *   **静默启动**: 特别为 Windows 实现了 `CREATE_NO_WINDOW (0x08000000)` flag，确保启动子程序时不会弹出一个难看的黑色 CMD 窗口。
    *   **生命周期**: 使用 `Mutex<HashMap>` 线程安全地记录了所有运行中子进程的 PID。如果用户关闭模块，我们能顺藤摸瓜杀掉对应的后台进程，防止内存泄漏。
*   **[x] Manifest 系统 (身份证)**:
    *   定义了 `Manifest` 结构体，它是 `manifest.json` 的严格映射。
    *   后端现在能看懂模块的“身份证”，知道它叫什么、用什么语言写、入口文件在哪里。
*   **[x] IPC 接口暴露**:
    *   在 `commands.rs` 中实现了 `launch_module` 和 `stop_module` 函数。
    *   这就像是把引擎的“点火开关”接到了驾驶室（前端），React 现在可以通过 `invoke` 调用这些函数了。

### 1.3 资源编译 (The Icon Incident)
*   **[x] 图标资源修复**:
    *   解决了 `tauri-build` 对图标格式的严格检查问题。
    *   确保构建流水线（Pipeline）能顺利走到 `Finished` 状态。

---

## 🟡 Step 2: 前端声明式引擎 (The Declarative UI)
**状态**: 📅 [待开始 / Pending]
**位置**: `src/core/SchemaRenderer/`

这一步是 Phase 2 的重头戏。我们要实现 **"RimWorld 风格"** 的低代码 UI 系统。
**目标**：用户只需写一个 JSON 文件，Atlas 就能自动画出界面。

### 2.1 引擎核心 (Engine Core)
*   **[ ] JSON5 解析器集成**:
    *   引入 `json5` 库。为什么？因为标准 JSON 不能写注释 (`//`)，这对配置文件来说是反人类的。JSON5 允许注释和尾逗号。
*   **[ ] SchemaRenderer 组件**:
    *   编写一个递归 React 组件 `<SchemaRenderer config={json} />`。
    *   它就像一个**翻译官**：看到 `"type": "input"`，就自动渲染成 Atlas 的漂亮的输入框组件。

### 2.2 组件映射 (Component Mapping)
我们要建立一个“军火库”，把 JSON 里的指令映射到实际的 UI 武器上：
*   **[ ] 基础控件**:
    *   `"input"` -> `<Input />` (带验证功能)
    *   `"button"` -> `<Button />` (带点击反馈)
    *   `"label"` -> `<Typography />`
*   **[ ] 布局控件**:
    *   `"container"` -> `<SettingCard />` (卡片式容器)
    *   `"group"` -> `<Stack />` (水平/垂直排列)

### 2.3 数据绑定 (State Binding)
这是最难的部分。界面画出来是死的，数据得是活的。
*   **[ ] 动态表单状态**:
    *   创建一个 `Store` (基于 Zustand)，专门存储 JSON 里定义的 `id`。
    *   比如 JSON 里写了 `id: "port"`，当用户在输入框打字时，Store 里的 `"port"` 值要实时更新。
*   **[ ] 简单条件渲染**:
    *   实现 `"hidden": "!$enable_proxy"` 这种逻辑。
    *   当用户关闭“启用代理”开关时，下方的“端口”输入框要自动消失。

---

## ⚪ Step 3: 前后端联调 (Integration)
**状态**: 📅 [计划中 / Planned]

当 Step 1 (引擎) 和 Step 2 (仪表盘) 都做好了，最后一步就是把线接上。

### 3.1 真实链路测试
*   **[ ] 创建 Demo 模块**:
    *   写一个真实的 `script.py` (比如每秒打印一行字的脚本)。
    *   写一个真实的 `layout.json5`。
*   **[ ] 点火测试**:
    *   用户在 React 界面点击“启动”按钮 -> 
    *   React 发送指令给 Rust -> 
    *   Rust 启动 Python -> 
    *   Python 跑起来了！

### 3.2 错误处理
*   **[ ] 异常反馈**:
    *   如果 Python 脚本路径写错了，Rust 报错，这个错误要能一路传回前端，弹窗告诉用户“找不到文件”。

---

**总结**：
目前我们站在 **Step 1** 和 **Step 2** 的交界处。
地基（Rust）已经打得非常牢固了，接下来就是平地起高楼（React UI 引擎）的时刻！
