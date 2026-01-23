# Rust 后端代码完全解析 (Step 1 复盘)

> **给 C 语言开发者的特别说明**：
> 这份文档旨在帮你建立 "Self-cognitive"（自我认知），让你真正理解刚才生成的代码，能够自己进行修改，而不是单纯复制粘贴。

---

##  1. 代码结构深度拆解

我们刚刚完成的是一个 **"后端进程管理系统"**。如果用 C 语言的思维来理解，它就像是一个能够处理 HTTP 请求的守护进程（Daemon），负责管理子进程的 `fork` 和 `exec`。

### A. 数据模型 (`src/models/manifest.rs`)
**类比 C**: `struct Manifest`

```rust
// #[derive(...)] 是 Rust 的"过程宏" (Procedural Macros)
// 它在编译时自动生成代码。
// Debug: 允许用 {:?} 打印结构体方便调试
// Clone: 允许 deep copy (类似 memcpy)
// Serialize/Deserialize: 自动实现 JSON 的序列化和反序列化
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Manifest {
    pub id: String, 
    // ...
}
```

**深度解析**：
*   **Struct**: Rust 的 Struct 和 C 的 Struct 内存布局类似，但在使用上更像 C++ 的 Class（可以有方法）。
*   **String vs &str**: 这里用 `String` 是因为 Manifest 所有权属于这个结构体，存在堆上（Heap）。如果是 `&str` 则是借用，需要考虑生命周期（Lifetime），初学者先用 `String` 最安全。

### B. 核心逻辑 (`src/core/process_manager.rs`)
**类比 C**: `ProcessManager` 单例对象

#### 1. 线程安全的进程表
```rust
pub struct ProcessManager {
    // HashMap: 类似 C++ std::map，存储 ID -> 进程句柄
    // Mutex: 互斥锁。
    // Child: 代表一个运行中的子进程句柄 (包含 PID, Stdin/out/err 管道)
    processes: Mutex<HashMap<String, Child>>,
}
```

**为什么需要 Mutex?**
Tauri 的 Command 处理是**多线程**的。如果前端同时发来两个 "Launch" 请求：
*   **C 语言**: 如果不加锁，两个线程同时写全局 HashMap，会导致内存破坏 (Race Condition)。
*   **Rust**: 编译器**强制**你把数据包在 `Mutex` 里。你**必须**先 `lock()` 拿到锁，才能访问里面的 HashMap。如果忘记 lock，代码根本编译不过。这是 Rust "编译期内存安全" 的核心体现。

#### 2. 启动进程 (Spawn)
```rust
pub fn start_module(...) {
    // Command 模式构建器
    let mut command = Command::new(program);
    
    // Windows 平台特定代码 (Conditional Compilation)
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        // 0x08000000 = CREATE_NO_WINDOW
        // 这是一个 Windows API flag，告诉 OS 不要为子进程创建控制台窗口
        command.creation_flags(0x08000000); 
    }

    // command.spawn() 真正执行系统调用 (CreateProcess / fork+exec)
    // 它返回 Result<Child, Error>
    match command.spawn() {
        Ok(child) => { 
            // 成功启动！
            // 1. 获取 PID
            let pid = child.id();
            // 2. 获取锁 (lock())
            // 3. 存入 HashMap
            self.processes.lock().unwrap().insert(manifest.id.clone(), child);
            Ok(pid)
        }
        Err(e) => { ... } // 启动失败 (如找不到文件)
    }
}
```

### C. 接口层 (`src/commands.rs`)
**类比 C**: API 路由层 (Controller)

```rust
// #[tauri::command] 负责处理 JSON 序列化、线程分发
pub fn launch_module(
    // 虽然前端传的是 JSON 文本，但 Tauri 会自动 parse 成 Rust Struct
    // 如果 JSON 格式对不上，这里直接会报错给前端
    manifest: Manifest,
    
    // 依赖注入 (Dependency Injection)
    // Tauri 在 main.rs 里 manage() 了 ProcessManager，这里就能自动取出来
    state: State<ProcessManager> 
) -> Result<u32, String> {
    // 这一层只做"转发"和简单的参数校验
    // 具体的业务逻辑全在 ProcessManager 里
    state.start_module(&manifest, 8080)
}
```

---

## 🛠️ 2. 如果你想自己写... (Phase 2 Step 2 预告)

接下来我们要写 **React 前端** (UI Schema 引擎)。
既然你想“学点东西”，我建议 Step 2 我们采用 **"结对编程 (Pair Programming)"** 模式：

1.  **架构**：我们已经有了 `layout.json5` 的设想。
2.  **你的任务**：
    *   不要让我一次性生成所有代码。
    *   先让我生成一个“最简原型” (比如只能渲染一个按钮)。
    *   **你** 去阅读代码，尝试自己加一个“输入框”的支持。
    *   遇到不懂的 `useRef`, `useEffect` 再问我。

这样，等到 Phase 2 结束时，整个渲染引擎虽然是我起头的，但每一颗螺丝都是你拧紧的。

---

## 📝 你的作业 (Homework)

在进入下一步之前，请尝试完成以下操作来验证你的掌控力：

1.  **跑通检查**：在 `src-tauri` 目录下运行 `cargo check`，直到看见绿色的 `Finished`。
2.  **阅读代码**：打开 `process_manager.rs`，找到 `println!("正在启动进程: {} {:?}", program, args);` 这行。
    *   试着把它改成中文日志，或者加点 emoji。
    *   以此确认你知道去哪里修改逻辑。
