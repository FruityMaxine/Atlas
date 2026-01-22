# Phase 2 实施计划：后端与声明式框架 (Phase 2 Master Plan)

## 🎯 阶段目标 (Phase 2)
本阶段标志着 Atlas 从“UI 原型”进入“功能实现”。我们将构建双核心：
1.  **Rust Backend**: 强大的进程管理器，负责“干脏活”（启动 Python/Java、管理端口）。
2.  **Declarative Framework**: 基于 **JSON5** 的低代码 UI 引擎。

---

## 🏗️ 双核心架构设计

```mermaid
graph TD
    User[用户开发] -->|编写| JSON[layout.json5]
    User -->|编写| Script[Python/Java 脚本]
    
    subgraph Atlas_Frontend [Atlas 前端 (React)]
        Loader[模块加载器] -->|解析| JSON
        Renderer[SchemaRenderer (渲染引擎)] -->|递归渲染| UI[动态 UI 界面]
        UI -->|双向绑定| State[Zustand Store]
    end
    
    subgraph Atlas_Backend [Atlas 后端 (Rust)]
        IPC[Tauri Commands] -->|指令| PM[ProcessManager]
        PM -->|Spawn| Child[子进程 (Script)]
    end
```

---

## 🛠️ 模块 A: Rust 进程管理器 (Backend)

*目标：让 Atlas 能够像操作系统一样管理子程序的生命周期。*

### 1. 目录结构规范
```text
src-tauri/src/
├── core/
│   ├── process_manager.rs  # 核心：使用 std::process::Command 启动/停止进程
│   └── process_store.rs    # 状态：使用 Arc<Mutex<...>> 存储运行中的 PID
└── commands.rs             # 接口：暴露 launch_module, stop_module 给前端
```

### 2. 关键技术点
- **静默启动**: Windows 下使用 `CREATE_NO_WINDOW` flag。
- **端口管理**: 自动寻找空闲端口，通过 `--port` 传入参数。

---

## 🛠️ 模块 B: 声明式 UI 引擎 (Frontend)

*目标：实现 "No-Code UI"，支持 JSON5 配置。*

### 1. UI Schema 规范 (layout.json5)
**格式**: JSON5 (支持注释、宽松语法)。

```json5
{
  "pages": {
    "main": {
      "components": [
        // 容器组件 (SettingCard)
        { 
          "type": "container", 
          "component": "SettingCard",
          "props": { "title": "基础配置" },
          "children": [
            // 基础控件
            { "type": "input", "id": "url", "label": "网址", "required": true },
            { "type": "toggle", "id": "advanced", "label": "高级模式" }
          ]
        },
        // 条件渲染组件
        {
          "type": "input",
          "id": "proxy_ip",
          "label": "代理IP",
          "hidden": "!$advanced" // 当 advanced 为 false 时隐藏
        }
      ]
    }
  }
}
```

### 2. 渲染器实现 (SchemaRenderer)
位于 `src/components/core/SchemaRenderer/`：

- **SchemaParser**: 负责解析 JSON5，处理 `$ref` (复用) 和 `i18n` 字符串。
- **ComponentRegistry**: 映射表 `{ "input": Input, "card": SettingCard }`。
- **StateEngine**: 
    - 维护一个即时更新的 `FormData` 对象。
    - 处理 `hidden: "!$advanced"` 这里的逻辑判断 (Expression Evaluation)。

### 3. 多页面与路由
- 模块内部实现简单的 "View Stack" (视图栈)。
- 默认显示 `entry` 指向的页面。
- 按钮动作支持 `"action": "navigate:settings"` 跳转页面。

---

## 📅 执行步骤

1.  **基础准备**:
    - [ ] Rust 环境清理与重构。
    - [ ] 引入 `json5` 解析库 (前端)。

2.  **Rust 核心 (ProcessManager)**:
    - [ ] 实现 `start_process` 和 `kill_process`。
    - [ ] 实现最简单的 Tauri Command 联调。

3.  **Schema 引擎 (The Engine)**:
    - [ ] **v0.1**: 实现 `layout.json5` 读取，仅支持平铺 Input/Button。
    - [ ] **v0.2**: 支持 `container` 嵌套渲染 (`SettingCard`)。
    - [ ] **v0.3**: 实现多页面切换逻辑。
    - [ ] **v0.4**: 实现条件渲染 (`hidden` 逻辑)。

4.  **端到端测试**:
    - 用一个真实的 Python 脚本 + 包含多页面的 JSON5 配置，跑通整个“配置 -> 界面 -> 运行”流程。

## ⚠️ 风险控制
- **条件逻辑复杂度**: 在 JSON 里写逻辑（如 `!$foo && $bar`）比较容易出错。早期版本只支持简单的布尔取反。
- **Schema 验证**: 需要严格的 TypeScript 类型定义来辅助开发 `SchemaRenderer`。
