#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod core;
mod models;

use core::process_manager::ProcessManager;

fn main() {
    tauri::Builder::default()
        // 初始化进程管理器状态，使其在所有 Command 中可访问
        .manage(ProcessManager::new())
        // 注册 IPC 命令处理函数
        .invoke_handler(tauri::generate_handler![
            commands::launch_module,
            commands::stop_module
        ])
        .run(tauri::generate_context!())
        .expect("Tauri 应用程序运行失败");
}
