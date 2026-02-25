# Atlas - 模块化启动器框架

> 一个具有 ClashVerge 级别 UI 的跨语言模块化桌面应用框架

**版本**: v0.2.1  
**技术栈**: Tauri + React + TypeScript + Rust  
**开发状态**: 🚧 开发中 (Phase 2: 声明式UI引擎构建完毕，正推进Rust进程管理与错误校验)
**项目名称**: Atlas 而非 Atlas Workbench

---

## 📋 目录

- [项目概述](#项目概述)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [功能需求](#功能需求)
- [架构设计](#架构设计)
- [开发路线图](#开发路线图)
- [快速开始](#快速开始)

---

## 🎯 项目概述

### 什么是 Atlas ？

Atlas 是一个**模块化桌面应用启动器框架**，灵感来源于 ClashVerge。

**核心理念：高度兼容，最小修改**

> **💡 1% 修改原则**：改造现有 GitHub 项目时，**无需修改原有业务代码**，只需添加薄薄一层 HTTP 接口（约 30 行代码），即可集成到 Atlas 中。

**架构图**：
```
Atlas 启动器（主程序，TypeScript + React）
    ↓ 通过 HTTP 调用
┌────────────┬───────────┬──────────┐
│ Python 模块 │ Java 模块 │ Go 模块  │
│ (Flask)     │(Spring)   │ (Gin)    │
│ 原业务逻辑  │ 原业务逻辑│原业务逻辑│ ← 100% 保持不变
│ 完全不动    │ 完全不动  │完全不动  │
└────────────┴───────────┴──────────┘
```

**关键特性**：
- ✅ **无需重写代码**：Java 项目不需要改成 Python，保持原样即可
- ✅ **语言无关**：任何能提供 HTTP API 的语言都能集成
- ✅ **最小改动**：只需添加健康检查端点 + 端口参数 + React UI 组件

### 应用场景

1. **统一界面管理多个工具**
   - 爬虫工具、下载器、转换工具等
   - 每个工具独立开发，通过 Atlas 统一管理

2. **GitHub 项目改造**
   - 将现有 GitHub CLI 项目改造为可视化模块
   - 提供统一的现代化 UI

3. **模块化开发**
   - 模块前后端分离
   - 支持任何语言编写后端业务逻辑

---

## ✨ 核心特性

### 1. 跨语言模块支持

| 语言 | 支持方式 | 示例 |
|------|---------|------|
| Python | HTTP 服务（Flask/FastAPI） | 爬虫、数据处理 |
| Java | Spring Boot 服务 | 企业级工具 |
| C++ | HTTP Server | 高性能计算 |
| Node.js | Express 服务 | Web 相关工具 |
| Go | Gin/Echo 服务 | 微服务工具 |

**实现方式**：
- 后端：任何语言，以 HTTP 服务形式运行
- 前端：统一使用 React 编写 UI
- 通信：RESTful API

### 2. UI 嵌入式显示

```
┌─────────────────────────────────┐
│  Atlas 主窗口                   │
│  ┌──────┬───────────────────┐  │
│  │侧边栏│  模块 UI 显示区    │  │
│  │      │  ┌──────────────┐ │  │
│  │[模块A]  │ 模块 A 的 UI │ │  │
│  │[模块B]  │ (动态加载)   │ │  │
│  │[模块C]  └──────────────┘ │  │
│  └──────┴───────────────────┘  │
└─────────────────────────────────┘
```

**特点**：
- ✅ 模块 UI 嵌入主窗口（不弹出独立窗口）
- ✅ 后端服务静默启动（无命令行窗口）
- ✅ 点击模块立即显示对应 UI

### 3. 声明式 UI 框架 (Declarative UI Framework)

**核心决策**：采用 **JSON5** 作为配置格式。
> **选择理由**：JSON5 支持**注释**和宽松语法（支持尾逗号、单引号），既保留了 JSON 对 Web 开发者的亲和力（直接映射 React Props），又像配置文件一样易读易写。相比 XML，它更契合 React/TypeScript 生态。

**功能规范 (Feature Spec)**：

#### (1) 双模式支持 (Hybrid Mode)
- **纯声明模式**：仅通过 `layout.json5` 定义界面。
- **React 专家模式**：允许模块开发者编写 `.tsx` 组件，完全接管界面渲染（类似 Phase 1），甚至可以在 React 代码中调用声明式引擎的部分功能。

#### (2) 标准组件库调用
通过 `type` 字段直接调用 Atlas 内置的高质量组件：
```json5
// layout.json5
{
  "type": "input", 
  "label": "目标网址", 
  "id": "url",
  "validation": { "required": true, "regex": "^https?://" } // 增强：验证规则
}
```

#### (3) 嵌套与容器 (Nesting)
支持组件嵌套，构建复杂布局。例如使用 `SettingCard` 包裹多个选项：
```json5
{
  "type": "container",
  "component": "SettingCard", // 对应 src/components/ui/SettingCard
  "props": { "title": "网络设置", "icon": "wifi" },
  "children": [
    { "type": "toggle", "id": "proxy", "label": "使用代理" },
    { "type": "input", "id": "port", "label": "端口" } // 自动嵌套在卡片内
  ]
}
```

#### (4) 多页面导航 (Multi-Page Routing)
支持模块内多页面结构，例如分离“主页”和“设置页”：
```json5
{
  "pages": {
    "main": { "title": "控制台", "components": [...] },
    "settings": { "title": "高级配置", "components": [...] }
  },
  "entry": "main" // 默认入口
}
```

#### (5) 扩展性与自定义 (Extensibility)
- **组件注册制**：未来 Atlas 升级添加新组件（如 `Chart`），现有的 JSON 渲染器无需修改逻辑即可支持渲染。
- **模块自定义组件**：
    - *方式 A (组合)*：模块可以在 JSON 中定义“宏组件”（由基础组件组合而成）。
    - *方式 B (代码)*：在 React 模式下，模块可以注册自己的 React 组件供 JSON 引用。

#### (6) 开发者必备特性 (Essential Features)
除了上述功能，框架还将内置以下**关键能力**：
- **🔍 条件渲染 (Conditional Logic)**：(进行中)
  - 例：仅当 `"proxy_enabled": true` 时，才显示 "代理IP" 输入框。
  - 语法：`"hidden": "!$proxy_enabled"`
- **🌐 国际化 (i18n)**：(待办) JSON 中的字符串支持引用语言包 key，如 `s.module.start_btn`。
- **🛡️ 自动校验 (Validation)**：(待办) 输入框自动支持 Min/Max/Regex 校验，并提示错误。
- **⚡ 事件绑定 (Action Binding)**：(已完成) 按钮点击、终端输入自动触发后端 Python 函数 (`apiClient.post`)。
- **💬 终端级交互 (Interactive Terminal)**：(已完成) 允许在配置中直接挂载带 `onInputSubmit` 的控制台，作为开发者与后端的双层命令通道。

### 4. ClashVerge 级别 UI

**设计风格**：
- 深色主题优先
- 毛玻璃效果（backdrop-filter）
- 流畅动画（Framer Motion）
- 渐变色彩
- 现代化卡片布局

**参考色彩**：
```css
主色调: #3B82F6 (蓝色)
强调色: #8B5CF6 (紫色)
背景色: #1A1B26 (深蓝灰)
纸张色: #24283B (中蓝灰)
```

### 4. 模块热插拔

- 扫描 `modules/` 目录自动发现模块
- 无需重启应用即可加载新模块
- 支持模块启用/禁用

---

## 🤔 为什么选择这个技术栈？

### 问题 1：为什么不用 Python/Java 全栈开发？

**答案**：因为我们需要兼容**任意语言**的后端模块。

- ❌ **如果用 Python 做主程序**：Java 模块需要通过 Jython 或 JNI 调用，非常复杂
- ❌ **如果用 Java 做主程序**：Python 模块需要通过 Jep 调用，性能差
- ✅ **使用 TypeScript + HTTP**：任何语言只需暴露 HTTP API，完全解耦

### 问题 2：为什么不直接用 CLI（命令行）？

**答案**：用户体验差，无法实现 ClashVerge 级别的现代化 UI。

- ❌ **CLI**：黑窗口、纯文本、无进度条、无动画
- ✅ **React UI**：毛玻璃效果、实时进度、流畅动画、响应式布局

### 问题 3：TypeScript 比 JavaScript 好在哪？

**答案**：类型安全，避免运行时错误。

管理复杂的模块系统时，TypeScript 的类型检查能提前发现 90% 的 bug。

示例：
```typescript
// ❌ JavaScript：容易写错，运行时才报错
const module = modules[0];
module.startBackend();  // 如果 module 是 undefined，程序崩溃

// ✅ TypeScript：编译时就发现错误
interface Module {
  id: string;
  name: string;
  startBackend: () => Promise<void>;
}

const module: Module | undefined = modules[0];
if (module) {
  await module.startBackend();  // 安全！
}
```

---

## 🛠️ 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.2+ | UI 框架 |
| **TypeScript** | 5.3+ | 类型安全 |
| **Vite** | 5.0+ | 构建工具 |
| **MUI (Material-UI)** | 5.14+ | UI 组件库 |
| **TailwindCSS** | 3.3+ | 样式框架 |
| **Zustand** | 4.4+ | 状态管理 |
| **Axios** | 1.6+ | HTTP 客户端 |
| **React Router** | 6.20+ | 路由管理 |
| **Framer Motion** | (可选) | 动画库 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Tauri** | 1.5+ | 桌面应用框架 |
| **Rust** | 1.70+ | 系统层编程 |
| **Serde** | 1.0+ | 序列化/反序列化 |
| **Tokio** | 1.0+ | 异步运行时 |

### 模块技术栈（示例）

**Python 模块**：
- Flask / FastAPI (HTTP 服务)
- Flask-CORS (跨域支持)
- requests, beautifulsoup4 (业务逻辑)

**Java 模块**：
- Spring Boot (HTTP 服务)
- Maven / Gradle (构建工具)

---

## 📁 项目结构

### 完整目录树 (Updated for Phase 2)

```text
F:/bbb/Atlas_Workbench/Atlas/
│
├── 📄 README.md                         # 项目总览文档 ⭐
├── 📄 package.json                      # Node.js 依赖配置
├── 📄 tsconfig.json                     # TypeScript 配置
├── 📄 vite.config.ts                    # Build 配置
├── 📄 tailwind.config.js                # 样式配置
│
├── 📁 docs/                             # 项目文档库 (New)
│   ├── 📄 phase2_implementation_plan.md # Phase 2 实施计划
│   ├── 📄 proposal_declarative_ui.md    # 声明式 UI 架构提案
│   └── 📄 rust_guide.md                 # Rust 开发指南
│
├── 📁 src/                              # React 前端 (UI & Schema Engine)
│   ├── 📄 main.tsx                      # 入口
│   ├── 📄 App.tsx                       # 路由根组件
│   │
│   ├── 📁 core/                         # 核心引擎 (New)
│   │   ├── 📁 SchemaRenderer/           # 声明式 UI 渲染引擎 🌟
│   │   │   ├── 📄 index.tsx             # 递归渲染入口
│   │   │   ├── 📄 Parser.ts             # JSON5 解析与校验
│   │   │   ├── 📄 Binder.ts             # 数据双向绑定逻辑
│   │   │   └── 📄 Registry.ts           # 组件注册表
│   │   │
│   │   ├── 📄 ModuleLoader.tsx          # 智能加载器 (支持 .json5 & .tsx)
│   │   └── 📄 Store.ts                  # 全局状态 (Zustand)
│   │
│   ├── 📁 components/                   # 通用 UI 组件库
│   │   ├── 📁 layout/                   # 布局组件
│   │   │   ├── 📄 Layout.tsx
│   │   │   └── 📁 Sidebar/
│   │   ├── 📁 modules/                  # 模块相关组件
│   │   └── 📁 ui/                       # 基础原子组件 (可被 Schema 调用)
│   │       ├── 📁 Button/
│   │       ├── 📁 DecryptedText/
│   │       ├── 📁 Icon/
│   │       ├── 📁 Input/
│   │       ├── 📁 Modal/
│   │       ├── 📁 SegmentedControl/
│   │       ├── 📁 Select/
│   │       ├── 📁 SettingCard/
│   │       ├── 📁 Slider/
│   │       ├── 📁 TargetCursor/
│   │       ├── 📁 Toast/
│   │       ├── 📁 Toggle/
│   │       └── 📄 index.ts
│   │
│   └── 📁 types/                        # 类型定义
│       └── 📄 schema.d.ts               # UI Schema 类型定义
│
├── 📁 src-tauri/                        # Rust 后端 (Pro Architecture) ⭐⭐
│   ├── 📄 tauri.conf.json               # Tauri 配置
│   └── 📁 src/
│       ├── 📄 main.rs                   # 🚪 程序入口 (Entry Point)
│       ├── 📄 lib.rs                    # 📚 库入口 (Library Entry)
│       ├── 📄 setup.rs                  # ⚙️ 初始化 (Logger/Tray/SingleInstance)
│       ├── 📄 error.rs                  # 🚨 [关键] 全局统一错误定义 (AppError)
│       │
│       ├── 📁 modules/                  # 🧩 模块业务层
│       │   ├── 📄 scanner.rs            # 🕵️ 模块扫描器 (File I/O)
│       │   ├── 📄 parser.rs             # 📄 JSON5解析器
│       │   └── 📄 validator.rs          # 🛡️ 合法性校验
│       │
│       ├── 📁 services/                 # 🔧 核心服务层
│       │   ├── 📄 process.rs            # 🚀 进程启动器 (Spawn/Kill)
│       │   ├── 📄 monitor.rs            # 💓 健康检查 (Health Check)
│       │   └── 📄 store.rs              # 💾 全局状态管理 (AppState)
│       │
│       ├── 📁 commands/                 # 🗣️ 接口层 (Controllers)
│       │   ├── 📄 module_cmd.rs         # 业务指令 (launch/stop)
│       │   └── 📄 sys_cmd.rs            # 系统指令 (open_folder)
│       │
│       └── 📁 models/                   # 📦 数据模型 (DTOs)
│           ├── 📄 config.rs             # App配置
│           └── 📄 manifest.rs           # 模块配置 (ManifestStruct)
│
├── 📁 modules/                          # 插件生态 (Hybrid Mode)
│   │
│   ├── 📁 demo-declarative/             # 模式 A: 纯声明式模块 🌟
│   │   ├── 📄 manifest.json             # 基础元数据
│   │   ├── 📄 layout.json5              # 【核心】UI 布局配置 (无 React 代码)
│   │   └── 📁 backend/                  # 业务逻辑
│   │       └── 📄 script.py
│   │
│   ├── 📁 demo-hybrid/                  # 模式 B: 混合/专家模块
│   │   ├── 📄 manifest.json
│   │   ├── 📄 layout.json5              # 基础配置
│   │   ├── 📁 ui/                       # 自定义 React 组件 (覆盖默认渲染)
│   │   │   └── 📄 index.tsx
│   │   └── 📁 backend/
│   │
│   └── 📁 local-modules/                # 用户本地模块
│
└── 📁 dist/                             # 构建产物
```

---

## 🎯 功能需求

### Phase 1: 基础框架（第 1-4 周）

#### 1.1 React UI 基础

**功能**：
- [x] 主界面布局（侧边栏 + 内容区）
- [x] 侧边栏显示模块列表
- [ ] 点击模块切换内容区
- [ ] 主题切换（深色/浅色）
- [ ] 设置页面

**技术要点**：
- React Router 路由管理
- Zustand 状态管理
- 响应式布局（Flexbox/Grid）

#### 1.2 模块扫描与注册

**功能**：
- [ ] 扫描 `modules/` 目录
- [ ] 解析 `manifest.json`
- [ ] 构建模块注册表
- [ ] 检测模块变化（热重载）

**技术要点**：
- Tauri IPC 命令
- Rust 文件系统 API
- JSON 解析（serde_json）

#### 1.3 模块 UI 动态加载

**功能**：
- [ ] 动态导入模块 React 组件
- [ ] 错误边界处理
- [ ] 加载状态显示
- [ ] 模块隔离（沙箱）

**技术要点**：
- `React.lazy()` 动态导入
- Vite 动态 import
- Error Boundary

### Phase 2: 后端服务管理 & 声明式低代码框架（第 5-6 周）

#### 2.1 声明式 UI 前端引擎 (SchemaRenderer) - [完全体]

**功能已完成**：
- [x] 核心引挚：递归渲染 `layout.json5` 到 `React` 树
- [x] 布局管理器：`Group` (Flex响应式), `Container` (统一设置卡片)
- [x] 基础原子组件：`Input` (带附加操作按钮), `Button`, `Toggle`, `SegmentedControl`, `Slider`
- [x] 高阶/交互组件：`Poller` (定时轮询状态), `LogViewer` (具备双向通信的黑客级内置终端终端)
- [x] 数据管道：输入框回车拦截、双向数据绑定 (`Zustand` store 同步)、底层的 `apiClient` Payload 打包。

#### 2.2 服务进程启动与管理 - [🚧 开发中]

**基础进程控制**：
- [x] 启动 Python/Java 后端服务 (通过 Tauri `Command::spawn`)
- [ ] 静默启动（无命令行窗口，需深入改进）
- [ ] 端口管理（动态分配防冲突）
- [ ] Rust层：`apiClient` 与 Tauri Invoker 真正的系统资源双向打通

**技术要点**：
- Rust `std::process::Command`
- Windows `CREATE_NO_WINDOW` 标志
- 端口占用检测

**关键代码示例**：
```rust
// Windows 静默启动
#[cfg(target_os = "windows")]
fn start_service() -> Result<Child> {
    Command::new("python")
        .arg("modules/spider/backend/main.py")
        .arg("--port").arg("8080")
        .creation_flags(0x08000000)  // CREATE_NO_WINDOW
        .spawn()
}
```

#### 2.2 健康检查与自动重启 (Health Check & Auto-Restart)

**Rust Process Monitor 实现细节**：
- [ ] **主动探测**: 
  - 启动后每 `interval_ms` 毫秒发送 HTTP GET `/health` 请求。
  - 连续 `max_retries` 次失败判定为进程崩溃。
- [ ] **配置化策略**: 在 `manifest.json` 中配置：
  ```json
  "healthCheck": {
    "url": "http://localhost:{port}/health",
    "interval": 2000,
    "timeout": 1000,
    "maxRetries": 3,
    "autoRestart": true
  }
  ```
- [ ] **崩溃恢复**:
  - 捕获子进程退出码 (Exit Code)。
  - 若配置了 `autoRestart`，则等待 5s 后尝试重启。
  - 超过重启上限 (如 5 次) 后发送系统通知并停止尝试。

### Phase 3: 前后端通信（第 7-8 周）

#### 3.1 API 客户端

**功能**：
- [ ] 封装 Axios 请求
- [ ] 统一错误处理
- [ ] 请求拦截器
- [ ] 超时处理

**技术要点**：
```typescript
// ApiClient 封装
class ApiClient {
  async get(url: string) { ... }
  async post(url: string, data: any) { ... }
}

// 模块 UI 中使用
const result = await apiClient.post(
  'http://localhost:8080/api/scrape',
  { url: targetUrl }
);
```

#### 3.2 实时通信（可选）

**功能**：
- [ ] WebSocket 支持
- [ ] 进度推送
- [ ] 实时日志

### Phase 4: UI 美化（第 9-10 周）

#### 4.1 ClashVerge 风格实现

**设计要素**：
- [ ] 毛玻璃效果卡片
- [ ] 渐变色标题
- [ ] 流畅过渡动画
- [ ] 微交互效果

**关键 CSS**：
```css
/* 毛玻璃效果 */
.glass-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 渐变标题 */
.gradient-text {
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### 4.2 动画系统

- [ ] 页面切换动画
- [ ] 模块卡片 hover 效果
- [ ] 加载骨架屏
- [ ] Toast 通知

---

## 🏗️ 架构设计

### 核心架构图

```
┌────────────────────────────────────────────────┐
│          Atlas 主程序               │
│  ┌──────────────────────────────────────────┐ │
│  │  Tauri 窗口（WebView）                   │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │  React 前端                        │ │ │
│  │  │  ├─ Layout (侧边栏 + 内容区)       │ │ │
│  │  │  ├─ Sidebar (模块列表)             │ │ │
│  │  │  └─ ModuleContainer (动态 UI)      │ │ │
│  │  └────────────────────────────────────┘ │ │
│  │           ↕ Tauri IPC                    │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │  Rust 后端                         │ │ │
│  │  │  ├─ ModuleManager (扫描模块)       │ │ │
│  │  │  ├─ ProcessManager (启动服务)      │ │ │
│  │  │  └─ Commands (IPC 接口)            │ │ │
│  │  └────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────┘ │
└─────────────────┬──────────────────────────────┘
                  ↓ HTTP API
      ┌───────────┴───────────┬──────────────┐
      ▼                       ▼              ▼
┌─────────────┐     ┌──────────────┐   ┌────────┐
│ Python 模块 │     │  Java 模块   │   │ C++... │
│  (Flask)    │     │(Spring Boot) │   │        │
└─────────────┘     └──────────────┘   └────────┘
```

### 数据流

```
用户点击侧边栏模块
  ↓
Sidebar.tsx 触发事件
  ↓
调用 Tauri Command: start_module(id)
  ↓
Rust ProcessManager 启动后端服务
  ↓
等待服务健康检查通过
  ↓
ModuleLoader 动态加载模块 UI 组件
  ↓
ModuleContainer 渲染模块 UI
  ↓
用户在模块 UI 中操作
  ↓
模块 UI 通过 ApiClient 调用后端 HTTP API
  ↓
后端处理业务逻辑
  ↓
返回结果到前端显示
```

### 模块生命周期

```
[未加载] → [扫描] → [已注册] → [启动中] → [运行中] → [停止]
                         ↑                       ↓
                         └───────[重启]──────────┘
```

---

## 🔌 模块接口规范

> **重要说明**：本章节定义了模块与框架之间的"合同"，是开发模块的必读内容。

### 核心设计理念

Atlas 框架采用**"最小必须 + 可选增强"**的设计原则：

```
┌─────────────────────────────────────────┐
│  最小必须接口（3个）                    │
│  - 健康检查端点                         │
│  - 端口参数接受                         │
│  - React UI 组件                        │
│  ↓ 只要实现这3个，就能成为Atlas模块    │
└─────────────────────────────────────────┘
         ↓ 可选使用
┌─────────────────────────────────────────┐
│  框架提供的增强工具（用或不用都行）    │
│  - ApiClient (HTTP客户端)               │
│  - 日志系统                             │
│  - 通知系统                             │
│  - 任务管理                             │
│  - 配置存储                             │
└─────────────────────────────────────────┘
```

---

### 1. 最小必须接口

#### 1.1 健康检查端点（Health Check）

**后端必须实现**：

```python
# Python 示例
from flask import Flask
app = Flask(__name__)

@app.route('/health')
def health():
    return {'status': 'ok', 'version': '1.0.0'}
```

```java
// Java 示例
@GetMapping("/health")
public Map<String, String> health() {
    return Map.of("status", "ok", "version", "1.0.0");
}
```

**用途**：框架通过此端点检测模块是否启动成功。

---

#### 1.2 端口参数接受（Port Argument）

**后端必须支持命令行参数**：

```python
# Python 示例
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, required=True)
    args = parser.parse_args()
    
    app.run(host='127.0.0.1', port=args.port, debug=False)
```

```java
// Java 示例 (Spring Boot)
public static void main(String[] args) {
    System.setProperty("server.port", args[0]);  // 从命令行读取端口
    SpringApplication.run(Application.class, args);
}
```

**用途**：框架动态分配端口（如8080、8081），避免端口冲突。

**启动命令示例**：
```bash
python backend/main.py --port 8080
java -jar backend/app.jar 8081
```

---

#### 1.3 React UI 组件导出（UI Entry）

**前端必须导出默认组件**：

```tsx
// ui/index.tsx
import React from 'react';

export default function MyModuleUI() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>我的模块</h1>
      <p>这是模块的主界面</p>
    </div>
  );
}
```

**用途**：框架通过动态导入显示模块UI。

---

### 2. 框架提供的工具 API

模块可以**选择性使用**以下框架工具，提升开发效率。

#### 2.1 ModuleUIProps（注入到模块UI的Props）

```typescript
interface ModuleUIProps {
  // ===== 基础信息 =====
  moduleId: string;              // 模块唯一ID（如 "spider-module"）
  config: ModuleConfig;          // manifest.json 中的配置
  
  // ===== HTTP 客户端 =====
  apiClient: {
    get: (path: string) => Promise<any>;
    post: (path: string, data: any) => Promise<any>;
    put: (path: string, data: any) => Promise<any>;
    delete: (path: string) => Promise<any>;
  };
  
  // ===== 通知系统 =====
  onNotify: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  
  // ===== 任务管理 =====
  onTaskStart: (name: string) => string;           // 返回 taskId
  onTaskProgress: (taskId: string, progress: number) => void;  // 进度 0-100
  onTaskComplete: (taskId: string) => void;
  onTaskFail: (taskId: string, error: string) => void;
  
  // ===== 存储 API =====
  storage: {
    getConfig: <T>(key: string) => Promise<T | null>;
    setConfig: <T>(key: string, value: T) => Promise<void>;
    getDataPath: () => Promise<string>;  // 模块专属数据目录
  };
  
  // ===== 日志系统 =====
  logger: {
    info: (message: string, meta?: object) => void;
    warn: (message: string, meta?: object) => void;
    error: (message: string, meta?: object) => void;
    debug: (message: string, meta?: object) => void;
  };
}
```

#### 2.2 使用示例

```tsx
// ui/index.tsx
export default function DownloaderUI(props: ModuleUIProps) {
  const { apiClient, onNotify, onTaskStart, onTaskProgress, logger } = props;
  
  const handleDownload = async () => {
    logger.info('开始下载任务');
    
    const taskId = onTaskStart('下载视频: example.mp4');
    
    try {
      // 调用后端API（自动使用正确端口）
      const result = await apiClient.post('/api/download', {
        url: 'https://example.com/video.mp4'
      });
      
      // 更新进度（假设后端返回进度）
      onTaskProgress(taskId, 50);
      
      // 完成任务
      onTaskComplete(taskId);
      onNotify('下载完成！', 'success');
      
    } catch (error) {
      onTaskFail(taskId, error.message);
      onNotify('下载失败', 'error');
      logger.error('下载失败', { error });
    }
  };
  
  return (
    <div>
      <button onClick={handleDownload}>开始下载</button>
    </div>
  );
}
```

---

### 3. manifest.json 完整规范

```json
{
  // ===== 基本信息（必须） =====
  "id": "your-module",                    // 模块唯一ID（小写字母+连字符）
  "name": "你的模块",                      // 显示名称
  "version": "1.0.0",                     // 语义化版本号
  "description": "模块功能描述",           // 简短描述
  "author": "你的名字",                    // 作者
  "icon": "icon.png",                     // 图标路径（512x512 PNG推荐）
  
  // ===== 后端配置（必须） =====
  "backend": {
    "language": "python",                 // 语言：python、java、node、go、cpp
    "entrypoint": "backend/main.py",      // 后端入口文件
    "startCommand": "python {entrypoint} --port {port}",  // 启动命令模板
    "healthCheck": {
      "endpoint": "/health",              // 健康检查端点
      "interval": 5000,                   // 检查间隔（毫秒）
      "timeout": 3000,                    // 超时时间（毫秒）
      "retries": 3                        // 失败重试次数
    },
    "dependencies": {                     // 依赖声明（可选）
      "python": "requirements.txt",
      "java": "pom.xml"
    }
  },
  
  // ===== 前端配置（必须） =====
  "ui": {
    "entrypoint": "ui/index.tsx",         // UI 入口文件
    "theme": {                            // 主题配置（可选）
      "primaryColor": "#3B82F6",
      "icon": "🕷️"
    }
  },
  
  // ===== 权限声明（可选） =====
  "permissions": {
    "network": true,                      // 是否需要网络访问
    "filesystem": {
      "read": ["downloads/**", "config.json"],
      "write": ["downloads/**", "logs/**"]
    },
    "processSpawn": false                 // 是否需要启动子进程
  },
  
  // ===== 模块配置（可选） =====
  "settings": {                           // 用户可配置的设置项
    "downloadPath": {
      "type": "directory",
      "label": "下载路径",
      "default": "./downloads"
    },
    "maxConcurrency": {
      "type": "number",
      "label": "最大并发数",
      "default": 3,
      "min": 1,
      "max": 10
    },
    "enableProxy": {
      "type": "boolean",
      "label": "启用代理",
      "default": false
    }
  },
  
  // ===== 功能开关（可选） =====
  "features": {
    "taskManager": true,                  // 是否使用任务管理
    "logging": true,                      // 是否使用统一日志
    "storage": true                       // 是否使用存储API
  }
}
```

---

### 4. 模块文件结构规范

```
your-module/                     # 模块根目录
│
├── manifest.json                # 必须：模块配置文件
├── icon.png                     # 必须：模块图标
├── README.md                    # 推荐：模块说明文档
│
├── ui/                          # 前端部分
│   ├── index.tsx                # 必须：UI 入口组件
│   ├── components/              # 可选：子组件
│   │   ├── DownloadForm.tsx
│   │   └── ResultList.tsx
│   └── styles/                  # 可选：样式文件
│       └── module.css
│
└── backend/                     # 后端部分
    ├── main.py                  # 必须：后端入口（Python示例）
    ├── requirements.txt         # Python：依赖文件
    ├── config.json              # 可选：后端配置
    ├── core/                    # 可选：核心业务逻辑
    │   ├── downloader.py
    │   └── parser.py
    └── logs/                    # 可选：日志目录
```

---

### 5. 改造 GitHub 项目快速示例

以下是最简化的示例，详细步骤请参考 [模块开发指南.md](./docs/模块开发指南.md)。

**原始项目**（命令行爬虫）：
```python
# spider.py（别人的开源项目，500 行业务代码）
def scrape(url, depth):
    # ... 复杂的爬虫逻辑 ...
    return results
```

**你只需添加接口层**（30 行代码）：
```python
# main.py（新文件）
from flask import Flask, request
from spider import scrape  # 导入原项目逻辑

app = Flask(__name__)

@app.route('/health')
def health():
    return {'status': 'ok'}

@app.route('/api/scrape', methods=['POST'])
def api_scrape():
    data = request.json
    results = scrape(data['url'], data['depth'])  # 调用原逻辑
    return {'results': results}

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, required=True)
    args = parser.parse_args()
    app.run(host='127.0.0.1', port=args.port)
```

✅ **完成**！原 `spider.py` 业务代码**一行都不改**。

详细的实战指南请查看：
- [模块开发指南.md](./docs/模块开发指南.md) - 完整开发流程
- [高级功能.md](./docs/高级功能.md) - 多级菜单、WebSocket 等

---

### 6. 常见问题（FAQ）

#### Q1: 必须使用框架提供的工具吗？
**A**: 不必须。你可以完全自己实现所有功能，只要提供健康检查、端口参数、UI组件即可。

#### Q2: 可以用其他 HTTP 框架吗（如 FastAPI、Express）？
**A**: 可以。只要提供 HTTP API 即可，框架不限制后端技术。

#### Q3: 如何调试模块？
**A**: 参考 [模块开发指南.md](./docs/模块开发指南.md) 的"调试模块"章节。

#### Q4: 模块之间可以通信吗？
**A**: 当前版本不支持。未来可能通过框架提供的消息总线实现（详见"关键设计决策记录"）。

#### Q5: 如何分发模块？
**A**: 打包为 ZIP 文件，用户解压到 `modules/` 目录即可。

---

## 🗓️ 开发路线图

### 里程碑

| 阶段 | 时间 | 目标 | 状态 |
|------|------|------|------|
| **Phase 0** | 第 0 周 | 环境搭建、框架创建 | ✅ 完成 |
| **Phase 1** | 第 1-4 周 | React UI 基础框架 | ✅ 完成 |
| **Phase 2** | 第 5-6 周 | Rust 后端集成 & 声明式 UI | � 进行中 |
| **Phase 3** | 第 7-8 周 | 前后端通信 | 📅 计划中 |
| **Phase 4** | 第 9-10 周 | UI 美化优化 | 📅 计划中 |
| **Phase 5** | 第 11-12 周 | 示例模块开发 | 📅 计划中 |
| **Phase 6** | 第 13-14 周 | 打包发布 | 📅 计划中 |

### 详细开发任务 (Detailed Roadmap)

#### Phase 1: React UI 基础 (✅ Completed)
- [x] **基础设施**: Vite + React + TS 环境搭建，TailwindCSS 配置。
- [x] **组件库**: 
  - [x] 完成核心UI原子组件 (Input, Button, Slider, etc.)
  - [x] 实现暗色模式/主题切换 (ThemeContext)
- [x] **布局系统**: 
  - [x] Sidebar (侧边栏) 与 Layout 响应式布局
  - [x] 页面路由配置 (React Router)

#### Phase 2: 后端核心与声明式框架 (🚧 In Progress)
> **Goal**: 赋予 Atlas 实际启动进程的能力，并实现 JSON5 低代码引擎。

**2.1 Rust 后端 (Process Manager)**
- [ ] **环境重构**: 清理 `src-tauri`，建立 `core/`, `models/` 分层架构。
- [ ] **ProcessManager**: 
  - [ ] 使用 `std::process::Command` 实现跨平台进程启动。
  - [ ] Windows 平台静默启动优化 (`CREATE_NO_WINDOW`)。
  - [ ] 进程 PID 注册表管理 (`Arc<Mutex<HashMap>>`)。
- [ ] **Tauri IPC**: 暴露 `launch_module(id)` 和 `stop_module(id)` 接口。

**2.2 声明式 UI 引擎 (Declarative Engine) [✅ Completed]**
- [x] **Engine Core**:
  - [x] 引入 `json5` 解析库。
  - [x] 实现 `SchemaRenderer.tsx` 递归渲染器。
- [x] **Component Mapping**:
  - [x] 将 JSON `input` 映射到 `<Input />` (支持 actionButton)。
  - [x] 将 JSON `container` 映射到 `<SettingCard />`。
  - [x] 新增复杂原子组件: `<LogViewer />` (内置终端通道).
- [x] **Dynamic Features**:
  - [x] 简单的条件渲染 (`hidden: "!$enable"`)初具雏形。
  - [x] 实现表单数据收集 (`Zustand` 双向绑定 & `apiClient` 打包发送)。

#### Phase 3: 模块集成与全链路测试 (📅 Planned)
> **Goal**: 跑通 "配置 -> 界面 -> 启动 -> 运行" 的完整闭环。

- [ ] **Module Loader 2.0**: 优先读取 `layout.json5`，降级读取 `index.tsx`。
- [ ] **集成测试场景**:
  - 创建一个真实的 Python 爬虫脚本 (打印 Log)。
  - 编写 `layout.json5` 配置 UI。
  - 在 Atlas 中点击按钮 -> Rust 启动 Python -> Python 运行 -> 结束。
- [ ] **日志流接入**: 实现 Rust 实时读取子进程 `Common/Stderr` 并推送到前端显示。
## 🚀 快速开始

### 开发环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | 18+ | JavaScript 运行时 |
| npm | 9+ | 包管理器 |
| Rust | 1.70+ | （Phase 2 需要） |
| Python | 3.8+ | （模块开发需要） |
| Java | 11+ | （可选，Java 模块需要） |

### 安装依赖

```bash
# 进入项目目录
cd F:\bbb\Atlas_Workbench\Atlas

# 安装 Node.js 依赖
npm install

# 安装 Rust（Phase 2 需要）
# 访问 https://rustup.rs/
```

### 开发模式运行

```bash
# React 开发模式（当前阶段）
npm run dev
# 浏览器访问：http://localhost:1420

# Tauri 开发模式（Phase 2 后）
npm run tauri:dev
# 桌面窗口运行
```

### 构建发布

```bash
# 构建 Web 版本
npm run build

# 构建 Tauri 桌面应用（Phase 6）
npm run tauri:build
# 输出：src-tauri/target/release/atlas.exe
```

---

## 📚 文档索引

### 核心文档

- **[模块开发指南.md](./docs/模块开发指南.md)** - 如何开发和调试模块（含实战示例）
- **[高级功能.md](./docs/高级功能.md)** - 多级菜单、WebSocket 等高级功能
- **[技术实现.md](./docs/技术实现.md)** - Tauri IPC、动态加载等技术细节

### 其他文档（待创建）

- [快速开始.md](./docs/快速开始.md) - 如何运行和修改代码
- [学习指南.md](./docs/学习指南.md) - 4 周学习计划
- [项目结构说明.md](./docs/项目结构说明.md) - 详细文件说明

---

## 🧠 关键设计决策记录

> 本章节记录了项目初期的重要设计决定，供后期开发参考。

### 决策 1：为什么使用 HTTP 而不是 IPC/RPC？

**原因**：
- HTTP 是最通用的协议，任何语言都能轻松实现
- 不需要学习 gRPC、Thrift 等复杂框架
- 易于调试（浏览器、Postman）

**代价**：
- 性能略低于本地 IPC（可接受，模块间通信不频繁）

---

### 决策 2：为什么模块 UI 必须用 React？

**原因**：
- 统一技术栈，便于维护
- 可以复用主程序的组件库（按钮、卡片、主题）
- React 生态成熟，易于找到参考代码

**代价**：
- 模块开发者需要学习 React（但只需掌握基础）

---

### 决策 3：为什么不支持模块间通信？

**原因**：
- 避免模块间产生复杂依赖关系
- 简化架构，每个模块独立运行

**未来**：
- Phase 5 可能引入消息总线（Pub/Sub 模式）

---

### 决策 4：为什么选择 Tauri 而不是 Electron？

**原因**：
- 更小的包体积（3-10 MB vs 100+ MB）
- 更好的性能（Rust 后端）
- 更强的安全性（权限系统）

**代价**：
- 需要学习 Rust（但主要工作在 TypeScript）

---

## 📝 开发规范

### 代码风格

- TypeScript: ESLint + Prettier
- React: 函数式组件 + Hooks
- Rust: rustfmt + clippy

### 命名规范

- 组件文件: PascalCase (Sidebar.tsx)
- 工具函数: camelCase (apiClient.ts)
- 常量: UPPER_SNAKE_CASE
- CSS 类: kebab-case

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具相关
```

---

## 📄 许可证

[GPL-3.0](https://opensource.org/licenses/GPL-3.0) (GNU General Public License v3.0) - 允许商业使用，但任何基于本项目的修改必须保持开源并以相同协议发布。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发者**: Your Name  
**开始日期**: 2026-01-15  
**当前状态**: Phase 1 - React UI 开发中
**npm run dev:http://localhost:1420/**