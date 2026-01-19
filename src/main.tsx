// main.tsx - React 挂载入口
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/config';  // ← 初始化 i18n 配置（必须在 App 之前导入）
import App from './App';
import './index.css';

// 找到 HTML 中的 root 元素，挂载 React 应用
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
