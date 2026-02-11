use crate::core::process_manager::ProcessManager;
use crate::models::manifest::Manifest;
use std::net::TcpListener;
use tauri::State;

/// 启动模块命令。
///
/// 参数：
/// - `manifest`: 模块清单
/// - `wait_health`: 是否等待健康检查通过（默认 `false`，避免阻塞前端）
#[tauri::command]
pub fn launch_module(
    manifest: Manifest,
    wait_health: Option<bool>,
    state: State<ProcessManager>,
) -> Result<(u32, u16), String> {
    let port = TcpListener::bind("127.0.0.1:0")
        .and_then(|listener| listener.local_addr().map(|addr| addr.port()))
        .map_err(|err| format!("分配端口失败: {}", err))?;

    state.start_module(&manifest, port, wait_health.unwrap_or(false))
}

/// 停止模块命令。
#[tauri::command]
pub fn stop_module(id: String, state: State<ProcessManager>) -> Result<String, String> {
    state.stop_module(&id)
}

/// 扫描模块命令。
#[tauri::command]
pub fn scan_modules() -> Vec<Manifest> {
    crate::core::scanner::scan_modules()
}
