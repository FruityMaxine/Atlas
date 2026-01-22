# 提案：Atlas "RimWorld-style" 声明式 UI 框架 (Declarative UI Framework)

## 💡 核心理念
你提到的 "RimWorld 只需要 XML 就能写 Mod" 的想法非常棒，这完全改变了 Atlas 的定位：
从 **"React 模块启动器"** 进化为 **"低代码工具构建平台 (Low-code Tool Builder)"**。

**目标**：
模块开发者（甚至是你自己）**不需要写一行 React/HTML/CSS**，只需要写：
1.  **Python/C/Java 脚本** (业务逻辑)
2.  **JSON 配置文件** (描述界面长什么样)

Atlas 自动根据配置生成漂亮的、统一风格的 UI。

---

## 🎨 既然是 Framework，就要有“标准”

### 1. 界面描述文件 (`layout.json`)
不再需要 `index.tsx`。模块目录里只需要一个 `layout.json`。

**示例：一个爬虫模块的 UI 定义**
```json
{
  "title": "超级爬虫 v1",
  "layout": "vertical", 
  "components": [
    {
      "type": "group",
      "title": "基础设置",
      "children": [
        {
          "id": "target_url",
          "type": "input",
          "label": "目标网址",
          "placeholder": "https://example.com",
          "required": true
        },
        {
          "id": "thread_count",
          "type": "slider",
          "label": "线程数量",
          "min": 1,
          "max": 16,
          "default": 4
        }
      ]
    },
    {
      "type": "group",
      "title": "高级选项",
      "children": [
        {
          "id": "use_proxy",
          "type": "toggle",
          "label": "启用代理",
          "default": false
        },
        {
          "id": "mode",
          "type": "select",
          "label": "爬取模式",
          "options": [
            {"label": "快速", "value": "fast"},
            {"label": "深度", "value": "deep"}
          ]
        }
      ]
    },
    {
      "type": "action_panel",
      "children": [
        {
          "type": "button",
          "label": "开始爬取",
          "action": "start_crawling", 
          "style": "primary"
        }
      ]
    },
    {
      "type": "monitor",
      "label": "进度监控",
      "bind": "progress_status"  // 自动绑定后端传回的进度数据
    }
  ]
}
```

### 2. Atlas 渲染引擎 (The Engine)
我们需要在 `src/core` 实现一个 **`SchemaRenderer`** 组件。
它的工作是：
1.  读取 `layout.json`。
2.  遇到 `"type": "slider"` -> 渲染我们在 Phase 1 做好的漂亮 `Slider` 组件。
3.  自动处理数据绑定（用户拖动滑块 -> 自动更新变量 -> 点击按钮时传给 Python）。

### 3. 数据流 (后端交互)
当你点击“开始爬取”按钮：
1.  Atlas 收集所有组件的值：`{ target_url: "...", thread_count: 8, ... }`
2.  通过 HTTP POST 发送给 Python: `POST /api/action/start_crawling`
3.  Python 只要接收 JSON，干活，然后返回。

---

## 🏗️ 对项目结构的影响

这是一个**巨大的简化**。

**现在的模块结构 (Old)**:
```text
modules/spider/
├── ui/              <-- 需要写 React，复杂
│   ├── index.tsx
│   ├── style.css
│   └── utils.ts
├── backend/
│   └── main.py
└── manifest.json
```

**新的模块结构 (New - "RimWorld" Mode)**:
```text
modules/spider/
├── layout.json      <-- 只要写这个！(简单配置)
├── backend/
│   └── main.py
└── manifest.json
```

---

## 🚀 你的三个问题解答

### Q1: 什么时候变成 ClashVerge 那样的桌面 APP？
**答案**：**现在就可以**。
你现在运行的是 `npm run dev` (网页预览模式)。
只要运行 `npm run tauri:dev`，它就会弹出一个 `.exe` 窗口，看起来和 ClashVerge 一模一样（没有浏览器地址栏，有系统原生边框）。
Phase 2 完成后，这个 EXE 就能真的控制 Python 运行了。

### Q2: 项目结构会不会不够细分？
**答案**：**采用了你的 "Framework" 想法后，结构反而更清晰了**。
- **Atlas Core (框架层)**：负责脏活累活（渲染 UI、管理进程、处理通信）。这部分会很复杂，但是**一次编写，到处运行**。
- **Modules (插件层)**：变得极度简单（配置 + 脚本）。
即使功能再多，因为采用了“配置化”管理，也不会乱。

### Q3: 这种 "Framework" 目标会不会太宏大？
**答案**：**完全不会，这反而是 "降维打击"**。
- 让你去手写 10 个不同的 React 界面，那才是工作量大且难以维护。
- 写一个通用的“渲染器”，虽然起步稍难（大概需要 2-3 天开发 `SchemaRenderer`），但之后你写 100 个模块都只需要配 JSON。
- **这正是软件工程中的 "Don't Repeat Yourself (DRY)" 原则**。

---

## ✅ 建议的新路线

1.  **Phase 2 重心调整**：
    *   除了 Rust 后端，我们在前端增加一个子任务：**开发 `SchemaRenderer` (通用 UI 渲染器)**。
2.  **从简单的开始**：
    *   先实现支持：`Input` (输入框), `Button` (按钮), `Log` (日志显示)。
    *   用这个简单的渲染器跑通你的“爬虫模块”。
3.  **后续扩展**：
    *   再慢慢加 Slider, Toggle, Chart 等组件。

这个方向非常棒，这才是真正的“平台化”思维！
