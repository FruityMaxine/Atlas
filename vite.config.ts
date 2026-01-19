import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 
// Vite 配置文件
// 
// 功能说明：
// - 配置 Vite 开发服务器
// - 配置路径别名
// - 配置 React 插件
// - 配置构建选项
// 
// 注意事项：
// - Tauri 应用需要特殊的构建配置
// - 确保 clearScreen: false 以便 Tauri 正常工作
// 

export default defineConfig({
    plugins: [react()],

    // 防止 vite 清屏，保证 Tauri 开发正常
    clearScreen: false,

    // 开发服务器配置
    server: {
        port: 1420,
        strictPort: true,
    },

    // 环境变量前缀
    envPrefix: ["VITE_", "TAURI_"],

    // 路径别名配置
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@atlas/core": path.resolve(__dirname, "./src/core"),
            "@atlas/components": path.resolve(__dirname, "./src/components"),
        },
    },

    // 构建配置
    build: {
        // Tauri 使用的目标
        target: "esnext",
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        sourcemap: !!process.env.TAURI_DEBUG,
    },
});
