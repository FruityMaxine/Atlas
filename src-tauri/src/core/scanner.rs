use crate::models::manifest::Manifest;
use std::{fs, path::PathBuf};

/// 解析 `modules/` 目录根路径。
///
/// 开发模式下当前目录通常是 `src-tauri`，优先尝试 `../modules`。
/// 其他模式下尝试 `./modules`。
pub fn resolve_modules_root() -> PathBuf {
    let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    let local_modules = current_dir.join("modules");
    let parent_modules = current_dir.parent().map(|p| p.join("modules"));

    match parent_modules {
        Some(path) if path.exists() => path,
        _ => local_modules,
    }
}

/// 扫描模块目录并返回所有有效模块清单。
pub fn scan_modules() -> Vec<Manifest> {
    let mut modules = Vec::new();
    let modules_dir = resolve_modules_root();

    println!("正在扫描模块目录: {:?}", modules_dir);

    let entries = match fs::read_dir(&modules_dir) {
        Ok(entries) => entries,
        Err(err) => {
            eprintln!("读取模块目录失败 {:?}: {}", modules_dir, err);
            return modules;
        }
    };

    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let manifest_path = path.join("manifest.json");
        if !manifest_path.exists() {
            continue;
        }

        let content = match fs::read_to_string(&manifest_path) {
            Ok(content) => content,
            Err(err) => {
                eprintln!("读取 manifest 失败 {:?}: {}", manifest_path, err);
                continue;
            }
        };

        match serde_json::from_str::<Manifest>(&content) {
            Ok(manifest) => {
                println!("发现模块: {} ({})", manifest.name, manifest.id);
                modules.push(manifest);
            }
            Err(err) => {
                eprintln!("解析 manifest 失败 {:?}: {}", manifest_path, err);
            }
        }
    }

    modules
}
