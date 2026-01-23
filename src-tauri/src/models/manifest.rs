use serde::{Deserialize, Serialize};

/// 模块清单配置 (对应 manifest.json)
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Manifest {
    /// 模块唯一标识符
    pub id: String,
    /// 模块显示名称
    pub name: String,
    /// 版本号
    pub version: String,
    /// 模块描述
    pub description: Option<String>,
    /// 后端配置
    pub backend: BackendConfig,
    /// 前端界面配置
    pub ui: UiConfig,
    /// 健康检查配置
    #[serde(rename = "healthCheck")]
    pub health_check: Option<HealthCheckConfig>,
}

/// 后端服务配置
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BackendConfig {
    /// 编程语言 (python, java, etc.)
    pub language: String,
    /// 入口文件路径
    pub entrypoint: String,
    /// 启动命令模板
    #[serde(rename = "startCommand")]
    pub start_command: String,
}

/// 健康检查配置
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HealthCheckConfig {
    /// 检查地址
    pub url: String,
    /// 检查间隔 (毫秒)
    pub interval: u64,
    /// 超时时间 (毫秒)
    pub timeout: u64,
    /// 最大重试次数
    #[serde(rename = "maxRetries")]
    pub max_retries: u32,
    /// 是否自动重启
    #[serde(rename = "autoRestart")]
    pub auto_restart: bool,
}

/// UI 配置
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UiConfig {
    /// UI 入口文件
    pub entrypoint: String,
}
