use tauri::State;
use crate::core::process_manager::ProcessManager;
use crate::models::manifest::Manifest;

/// 启动模块命令
/// 前端调用: invoke('launch_module', { manifest: ... })
#[tauri::command]
pub fn launch_module(
    manifest: Manifest,
    state: State<ProcessManager>
) -> Result<u32, String> {
    // TODO: 实现动态端口分配逻辑
    let port = 8080;
    
    // 尝试启动模块
    state.start_module(&manifest, port)
}

/// 停止模块命令
/// 前端调用: invoke('stop_module', { id: '...' })
#[tauri::command]
pub fn stop_module(id: String, state: State<ProcessManager>) -> Result<String, String> {
    state.stop_module(&id)
}
