use serde::{Deserialize, Serialize};

/// 模块清单配置（对应 `manifest.json`）。
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Manifest {
    /// 模块唯一标识符。
    pub id: String,
    /// 模块显示名称。
    pub name: String,
    /// 版本号。
    pub version: String,
    /// 模块描述。
    pub description: Option<String>,
    /// 作者。
    pub author: Option<String>,
    /// 图标文件名或图标标识。
    pub icon: Option<String>,

    /// 后端配置。
    pub backend: BackendConfig,
    /// 前端配置。
    pub ui: UiConfig,
    /// 权限配置。
    pub permissions: Option<PermissionsConfig>,
}

/// 后端服务配置。
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BackendConfig {
    /// 是否启用后端。
    pub enabled: bool,
    /// 后端语言（`python`、`java`、`node` 等）。
    pub language: String,
    /// 入口文件路径（相对模块根目录）。
    pub entrypoint: String,
    /// 启动参数数组（支持 `{PORT}` 占位符）。
    pub args: Vec<String>,
    /// 默认端口。
    pub port: u16,
    /// 健康检查接口路径（例如：`/api/health`）。
    #[serde(alias = "healthCheck", alias = "health_check")]
    pub health_check: Option<String>,
}

/// UI 配置。
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UiConfig {
    /// UI 模式：`declarative`（声明式）或 `custom`（自定义 React）。
    pub mode: String,
    /// 声明式布局文件路径或自定义入口文件路径。
    pub layout: Option<String>,
}

/// 权限配置。
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PermissionsConfig {
    /// 是否需要网络访问。
    pub network: Option<bool>,
    /// 文件系统访问权限。
    pub filesystem: Option<FilesystemPermissions>,
}

/// 文件系统权限。
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FilesystemPermissions {
    /// 可读路径列表。
    pub read: Option<Vec<String>>,
    /// 可写路径列表。
    pub write: Option<Vec<String>>,
}
