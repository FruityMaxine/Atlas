use std::process::{Command, Child};
use std::sync::Mutex;
use std::collections::HashMap;
use crate::models::manifest::Manifest;

/// 进程管理器
/// 负责管理所有后端子进程的生命周期 (启动、停止、监控)
pub struct ProcessManager {
    // 使用 Mutex 确保跨线程安全访问 (Tauri commands 是多线程的)
    // 存储子进程句柄，以便后续可以终止它们
    processes: Mutex<HashMap<String, Child>>,
}

impl ProcessManager {
    pub fn new() -> Self {
        Self {
            processes: Mutex::new(HashMap::new()),
        }
    }

    /// 启动模块后端进程
    pub fn start_module(&self, manifest: &Manifest, port: u16) -> Result<u32, String> {
        // 构建启动命令
        // 替换模板变量: {entrypoint} -> main.py, {port} -> 8080
        let cmd_str = manifest.backend.start_command
            .replace("{entrypoint}", &manifest.backend.entrypoint)
            .replace("{port}", &port.to_string());
        
        // 简单分割命令参数 (生产环境建议使用 shell-words crate 处理引号)
        let parts: Vec<&str> = cmd_str.split_whitespace().collect();
        if parts.is_empty() {
            return Err("启动命令为空".to_string());
        }
        let program = parts[0];
        let args = &parts[1..];

        println!("正在启动进程: {} {:?}", program, args);

        let mut command = Command::new(program);
        command.args(args);

        // Windows 平台特定配置
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            // CREATE_NO_WINDOW = 0x08000000
            // 这个标志防止弹出黑色的控制台窗口
            command.creation_flags(0x08000000);
        }

        // 执行启动
        match command.spawn() {
            Ok(child) => {
                let pid = child.id();
                // 获取锁并存入 map
                let mut map = self.processes.lock().map_err(|e| e.to_string())?;
                map.insert(manifest.id.clone(), child);
                println!("模块 {} 已启动，PID: {}", manifest.id, pid);
                Ok(pid)
            },
            Err(e) => Err(format!("无法启动进程: {}", e)),
        }
    }

    /// 停止模块后端进程
    pub fn stop_module(&self, id: &str) -> Result<String, String> {
        let mut map = self.processes.lock().map_err(|e| e.to_string())?;
        
        if let Some(mut child) = map.remove(id) {
            match child.kill() {
                Ok(_) => Ok(format!("模块 {} 已终止", id)),
                Err(e) => Err(format!("无法终止模块 {}: {}", id, e)),
            }
        } else {
            Err(format!("未找到运行中的模块: {}", id))
        }
    }
}
