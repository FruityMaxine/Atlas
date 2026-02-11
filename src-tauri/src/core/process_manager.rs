use crate::core::scanner::resolve_modules_root;
use crate::models::manifest::Manifest;
use std::{
    collections::HashMap,
    io::{Read, Write},
    net::{SocketAddr, TcpStream},
    process::{Child, Command},
    sync::Mutex,
    thread,
    time::Duration,
};

struct ManagedProcess {
    child: Child,
    port: u16,
}

/// 进程管理器，负责模块后端进程的启动、复用和停止。
pub struct ProcessManager {
    /// 运行中的进程表：`模块 ID -> 进程句柄`
    processes: Mutex<HashMap<String, ManagedProcess>>,
}

impl ProcessManager {
    pub fn new() -> Self {
        Self {
            processes: Mutex::new(HashMap::new()),
        }
    }

    /// 启动模块后端并返回 `(pid, port)`。
    ///
    /// - 若模块已在运行，直接复用并返回现有 `(pid, port)`。
    /// - `wait_health = true` 时会等待健康检查通过后再返回。
    pub fn start_module(
        &self,
        manifest: &Manifest,
        port: u16,
        wait_health: bool,
    ) -> Result<(u32, u16), String> {
        if !manifest.backend.enabled {
            return Err("模块后端未启用".to_string());
        }

        {
            let mut map = self.processes.lock().map_err(|err| err.to_string())?;
            if let Some(existing) = map.get_mut(&manifest.id) {
                match existing.child.try_wait() {
                    Ok(None) => {
                        let pid = existing.child.id();
                        return Ok((pid, existing.port));
                    }
                    Ok(Some(_)) => {
                        // 进程已经退出，后续走重新启动流程。
                    }
                    Err(err) => {
                        return Err(format!("检查进程状态失败: {}", err));
                    }
                }
            }
            map.remove(&manifest.id);
        }

        let language = manifest.backend.language.to_lowercase();
        let program = match language.as_str() {
            "python" => "python",
            "node" | "javascript" => "node",
            "java" => "java",
            _ => return Err(format!("不支持的后端语言: {}", language)),
        };

        let args: Vec<String> = manifest
            .backend
            .args
            .iter()
            .map(|arg| arg.replace("{PORT}", &port.to_string()))
            .collect();

        let mut final_args = vec![manifest.backend.entrypoint.clone()];
        final_args.extend(args);

        let module_path = resolve_modules_root().join(&manifest.id);
        if !module_path.exists() {
            return Err(format!("模块目录不存在: {:?}", module_path));
        }

        let mut command = Command::new(program);
        command.args(&final_args);
        command.current_dir(&module_path);

        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            command.creation_flags(CREATE_NO_WINDOW);
        }

        let mut child = command
            .spawn()
            .map_err(|err| format!("启动进程失败: {}", err))?;
        let pid = child.id();

        if wait_health {
            wait_for_health(manifest, port).map_err(|err| {
                let _ = child.kill();
                format!("模块 {} 健康检查失败: {}", manifest.id, err)
            })?;
        }

        let mut map = self.processes.lock().map_err(|err| err.to_string())?;
        map.insert(manifest.id.clone(), ManagedProcess { child, port });

        println!(
            "模块 {} 已启动，PID: {}，端口: {}",
            manifest.id, pid, port
        );
        Ok((pid, port))
    }

    /// 停止模块后端进程。
    pub fn stop_module(&self, id: &str) -> Result<String, String> {
        let mut map = self.processes.lock().map_err(|err| err.to_string())?;
        if let Some(mut process) = map.remove(id) {
            match process.child.kill() {
                Ok(_) => Ok(format!("模块 {} 已停止", id)),
                Err(err) => Err(format!("停止模块 {} 失败: {}", id, err)),
            }
        } else {
            Err(format!("未找到运行中的模块: {}", id))
        }
    }
}

const HEALTH_RETRY_COUNT: u8 = 20;
const HEALTH_RETRY_INTERVAL_MS: u64 = 200;
const HEALTH_TIMEOUT_MS: u64 = 800;

fn normalize_health_path(raw_path: Option<&str>) -> String {
    let path = raw_path
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .unwrap_or("/health");

    if path.starts_with('/') {
        path.to_string()
    } else {
        format!("/{}", path)
    }
}

fn wait_for_health(manifest: &Manifest, port: u16) -> Result<(), String> {
    let path = normalize_health_path(manifest.backend.health_check.as_deref());
    for _ in 0..HEALTH_RETRY_COUNT {
        if check_health_endpoint(port, &path) {
            return Ok(());
        }
        thread::sleep(Duration::from_millis(HEALTH_RETRY_INTERVAL_MS));
    }

    Err(format!(
        "重试 {} 次后仍无法访问健康检查端点: http://127.0.0.1:{}{}",
        HEALTH_RETRY_COUNT, port, path
    ))
}

fn check_health_endpoint(port: u16, path: &str) -> bool {
    let address = SocketAddr::from(([127, 0, 0, 1], port));
    let timeout = Duration::from_millis(HEALTH_TIMEOUT_MS);
    let mut stream = match TcpStream::connect_timeout(&address, timeout) {
        Ok(stream) => stream,
        Err(_) => return false,
    };

    let _ = stream.set_read_timeout(Some(timeout));
    let _ = stream.set_write_timeout(Some(timeout));

    let request = format!(
        "GET {} HTTP/1.1\r\nHost: 127.0.0.1:{}\r\nConnection: close\r\n\r\n",
        path, port
    );

    if stream.write_all(request.as_bytes()).is_err() {
        return false;
    }

    let mut response = String::new();
    if stream.read_to_string(&mut response).is_err() {
        return false;
    }

    response.starts_with("HTTP/1.1 2") || response.starts_with("HTTP/1.0 2")
}
