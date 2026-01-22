# Phase 2: 后端核心与声明式框架 (Backend Core & Declarative Framework)

- [ ] **Phase 2 准备与规范 (Preparation)**
    - [x] Phase 2 实施计划与架构设计 <!-- id: 0 -->
    - [x] Rust 快速上手指南 <!-- id: 1 -->
    - [ ] **(NEW)** 定义 UI Schema 规范 (v1.0 draft) <!-- id: 11 -->

- [ ] **Rust 后端核心 (Backend Core)**
    - [ ] 验证开发环境 & 重构 src-tauri <!-- id: 4 -->
    - [ ] **ProcessManager**: 进程启动与生命周期管理 <!-- id: 6 -->
        - [ ] Spawn process (Standard & Silent) <!-- id: 7 -->
        - [ ] Kill process <!-- id: 8 -->
    - [ ] **Tauri Commands**: 编写 IPC 接口 (launch/stop) <!-- id: 9 -->

- [ ] **声明式 UI 引擎 (Declarative Engine)**
    - [ ] **Schema Definition**: 设计 `layout.json` 结构标准 (Input, Button, Slider, etc.) <!-- id: 12 -->
    - [ ] **SchemaRenderer**: 开发 React 通用渲染组件 <!-- id: 13 -->
        - [ ] 基础组件支持 (Input, Button, Label) <!-- id: 14 -->
        - [ ] 交互组件支持 (Toggle, Slider, Select) <!-- id: 15 -->
    - [ ] **Data Binding**: 实现 UI 控件与后端参数的双向绑定 <!-- id: 16 -->

- [ ] **模块系统集成 (Integration)**
    - [ ] 模块加载器适配: 优先读取 `layout.json` <!-- id: 17 -->
    - [ ] 综合测试: 使用 Python 爬虫脚本 + JSON 配置跑通全流程 <!-- id: 18 -->
