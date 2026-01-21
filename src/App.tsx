/**
 * React 应用主入口
 *
 * 功能说明：
 * - React 应用的根组件
 * - 管理页面路由和导航
 * - 左侧 Sidebar + 右侧内容区布局
 *
 * 主要内容：
 * 1. 页面状态管理（currentPage）
 * 2. 页面组件导入和渲染
 * 3. 路由切换逻辑
 */

import { useState } from 'react';
import { Download, Wrench } from 'lucide-react';
import { Sidebar } from './components/layout';
import TargetCursor from './components/ui/TargetCursor';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';  // 导入 useSettings
import { ToastProvider } from './contexts/ToastContext';

// 导入页面组件
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import CrawlerPage from './pages/CrawlerPage';
import ComponentShowcasePage from './pages/ComponentShowcasePage';

// \u628aApp\u7684\u5185\u5bb9\u63d0\u53d6\u5230\u5355\u72ec\u7684\u7ec4\u4ef6\uff0c\u8fd9\u6837\u624d\u80fd\u4f7f\u7528useSettings
function AppContent() {
    // 当前页面状态，默认显示主页
    const [currentPage, setCurrentPage] = useState('home');
    // 注意：mouseAnimation 状态已移到 SettingsContext 中管理

    // 从 Context 获取 mouseAnimation 用于 key prop
    const { mouseAnimation } = useSettings();

    // 页面导航处理函数
    const handleNavigate = (pageId: string) => {
        setCurrentPage(pageId);
    };

    // 根据 currentPage 渲染对应的页面组件
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'settings':
                return <SettingsPage />;  // 不再需要传递 props，SettingsPage 内部用 useSettings() 读取
            case 'crawler':
                return <CrawlerPage />;
            case 'components':
                return <ComponentShowcasePage />;
            case 'downloader':
                return <DownloaderPlaceholder />;
            case 'tools':
                return <ToolsPlaceholder />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: 'var(--bg-tertiary)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
            {/* 全局光标特效：从 Context 读取 mouseAnimation */}
            {/* key prop 确保组件在状态改变时完全重新挂载，修复锁定功能失效问题 */}
            <TargetCursor
                key={`cursor-${mouseAnimation}`}
                spinDuration={2}
                hideDefaultCursor={true}
                parallaxOn={true}
            />

            {/* 左侧边栏 */}
            <Sidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
            />

            {/* 右侧内容区 */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                background: 'var(--bg-tertiary)',
            }}>
                {renderPage()}
            </div>
        </div>
    );
}

// App 组件：提供 SettingsProvider
function App() {
    return (
        // 用 SettingsProvider 包裹整个应用，这样所有组件都能访问设置
        <SettingsProvider>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </SettingsProvider>
    );
}

// 占位组件：下载器页面
function DownloaderPlaceholder() {
    return (
        <div className="fade-in-up" style={{
            padding: '60px',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '80px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                <Download size={80} />
            </div>
            <h1 style={{
                fontSize: '42px',
                marginBottom: '16px',
                background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                下载器模块
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                敬请期待...
            </p>
        </div>
    );
}

// 占位组件：工具箱页面
function ToolsPlaceholder() {
    return (
        <div className="fade-in-up" style={{
            padding: '60px',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '80px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                <Wrench size={80} />
            </div>
            <h1 style={{
                fontSize: '42px',
                marginBottom: '16px',
                background: 'linear-gradient(90deg, #10B981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                工具箱模块
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                敬请期待...
            </p>
        </div>
    );
}

export default App;
