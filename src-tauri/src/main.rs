#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod core;
mod models;

use core::process_manager::ProcessManager;

fn main() {
    tauri::Builder::default()
        // 初始化进程管理器状态，供 IPC 命令共享访问。
        .manage(ProcessManager::new())
        // 注册前后端通信命令。
        .invoke_handler(tauri::generate_handler![
            commands::launch_module,
            commands::stop_module,
            commands::scan_modules
        ])
        .run(tauri::generate_context!())
        .expect("Tauri 应用启动失败");
}
