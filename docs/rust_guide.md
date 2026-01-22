# Rust 开发快速上手指南 (For C Developers)

欢迎进入 Phase 2！作为一个有 C 语言基础的开发者，你已经掌握了计算机最底层的思维方式（内存、指针、进程），这对学习 Rust 非常有帮助。Rust 就像是一个**配了 24 小时贴身高级保镖的 C 语言**。

---

## 1. Rust vs C: 核心思维转换

### 1.1 变量与内存
*   **C**: 变量默认可变。内存需要手动 `malloc/free`。
    *   *风险*: 忘记 free (泄漏)，free 之后再用 (悬空指针/UAF)。
*   **Rust**: 变量默认**不可变** (`let x = 5;`)。内存由**所有权 (Ownership)** 系统自动管理。
    *   *规则*: 一个值在同一时间只能有一个“主人”。主人离开作用域，值自动释放。
    *   *代码*: `let mut x = 5;` (加 `mut` 才是可变的)。

### 1.2 字符串
*   **C**: `char*` 或 `char[]`。以 `\0` 结尾，容易越界。
*   **Rust**: `String` (堆上动态字符串) 和 `&str` (字符串切片/视图)。
    *   *安全*: 自带长度信息，不会越界，自动管理内存。

### 1.3 指针 vs 引用
*   **C**: 指针 `*p` 满天飞，可以由 `void*` 随意强转，容易 Segfault。
*   **Rust**: 
    *   **引用 (`&x`)**: 借用数据，编译器确保引用永远指向有效数据（借用检查器）。
    *   **智能指针 (`Box`, `Arc`)**: 类似 C++ 的 `shared_ptr`，自动管理生命周期。
    *   *注意*: 在 Tauri 开发中，一般很少写 `unsafe` 指针。

### 1.4 错误处理
*   **C**: 函数返回 `-1` 或 `NULL` 表示错误，容易被忽略。
*   **Rust**: 返回 `Result<T, E>`。
    *   你**必须**处理这个结果 (要么 `match` 处理，要么 `unwrap()` 暴力解包)。
    *   *比喻*: 像是收快递，你必须先拆开盒子 (`Result`) 才能拿到里面的东西 (`T`)，如果盒子是空的 (`Error`) 就要报错。

---

## 2. Phase 2 工作中心：怎么写？

### 2.1 你的角色
你现在是**架构师**。Phase 1 是装修房子 (UI)，Phase 2 是铺设水电管道 (Backend)。
React UI 只是发号施令的，真正的“脏活累活”（启动进程、读写文件）由 Rust 完成。

### 2.2 如何实现功能 (Spawn Process)
在 C 中你可能用 `CreateProcess`。在 Rust 中，我们用 `std::process::Command`。

```rust
use std::process::Command;

// 就像构建一个命令对象
let mut child = Command::new("python")
    .arg("script.py")
    .spawn() // 启动！
    .expect("failed to execute process");
```

### 2.3 如何调试
1.  **Print 大法**: `println!("变量 x = {:?}", x);`
    *   注意：是 `{:?}` (Debug 格式) 不是 `%d`。
2.  **日志**: 在 Tauri 中，看终端输出。或者配置 `log` 库写文件。
3.  **VS Code**: 安装 `CodeLLDB` 插件，可以直接在 `src-tauri/src/main.rs` 打断点调试 Rust 代码！

---

## 3. 前后端交互：Tauri 的桥梁 (IPC)

这是最重要的部分：**React 怎么调用 Rust？**

### Rust 侧 (接收端)
你需要定义一个函数，并挂上 `#[tauri::command]` 牌子。

```rust
// src-tauri/src/main.rs 或 commands.rs

#[tauri::command] // 告诉 Tauri 这是一个可被调用的命令
fn greet(name: String) -> String {
    format!("Hello, {}! You've been handled by Rust.", name)
}
```

### React 侧 (发送端)
使用 `invoke` 函数。

```typescript
// src/App.tsx
import { invoke } from "@tauri-apps/api/tauri";

async function callRust() {
    // 'greet' 对应 Rust 函数名
    // { name: ... } 对应 Rust 函数参数
    const response = await invoke('greet', { name: 'World' });
    console.log(response); // "Hello, World! ..."
}
```

---

## 4. 代码规范：如何做大做强

为了防止代码变成“意大利面条”，我们在 Phase 2 严格遵守：

1.  **文件分离**: 不要把所有代码都塞进 `main.rs`。
    *   `command.rs`: 处理前端请求。
    *   `manager.rs`: 处理具体逻辑。
2.  **类型优先**: 先定义 `Struct` (结构体)，想清楚数据长什么样，再写逻辑。
3.  **Result 传播**: 尽量少用 `unwrap()` (因为这会导致崩溃)，多用 `?` 操作符把错误抛给上层处理。

---

## 5. 接下来怎么做？

请查看 `brain/implementation_plan.md`，那是具体的施工图纸。我们将从创建文件夹结构开始，一步步搭建起 Atlas 的后端心脏。
