/**
 * 侧边栏组件 - 导航栏
 * 
 * 结构：
 * - 顶部：Logo
 * - 主导航：开始、设置
 * - 分割线
 * - 模块导航：爬虫、下载器、工具箱
 */

import { Home, Palette, Settings, Bug, Download, Wrench, Zap, LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

interface SidebarProps {
    currentPage: string;
    onNavigate: (pageId: string) => void;
}

interface NavItem {
    id: string;
    name: string;
    icon: LucideIcon;
    color?: string;
}

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { t } = useTranslation();

    // 主导航项（顶部）
    const mainNavItems: NavItem[] = [
        { id: 'home', name: t('sidebar.home', '首页'), icon: Home },
        { id: 'components', name: t('sidebar.components', '组件演示'), icon: Palette },
        { id: 'settings', name: t('sidebar.settings', '系统设置'), icon: Settings },
    ];

    // 模块导航项（底部）
    const moduleItems: NavItem[] = [
        { id: 'crawler', name: t('sidebar.crawler', '爬虫模块'), icon: Bug, color: '#3B82F6' },
        { id: 'downloader', name: t('sidebar.downloader', '下载器'), icon: Download, color: '#8B5CF6' },
        { id: 'tools', name: t('sidebar.tools', '工具箱'), icon: Wrench, color: '#10B981' },
    ];

    // 导航按钮组件
    const NavButton = ({ item, isModule = false }: { item: NavItem; isModule?: boolean }) => {
        const isSelected = currentPage === item.id;
        const IconComponent = item.icon;

        // 动态样式仅用于模块颜色的边框，其他大部分样式已移至 CSS
        // 这里如果是模块且被选中，我们需要应用特定颜色的边框
        // 这是一个真正的动态样式，适合保留 inline style
        const dynamicStyle = isSelected && isModule && item.color
            ? { borderColor: item.color }
            : {};

        return (
            <div
                className={`atlas-sidebar-nav-btn cursor-target ${isSelected ? 'active' : ''} ${isModule ? 'module-active' : ''}`}
                onClick={() => onNavigate(item.id)}
                style={dynamicStyle}
            >
                <IconComponent size={20} />
                <span className="atlas-sidebar-nav-text">
                    {item.name}
                </span>
            </div>
        );
    };

    return (
        <div className="atlas-sidebar">
            {/* Logo */}
            <div className="atlas-sidebar-logo-container">
                <h1 className="atlas-sidebar-logo">
                    <Zap size={28} />
                    Atlas
                </h1>
                <p className="atlas-sidebar-version">
                    {t('sidebar.version', 'Workbench v1.1')}
                </p>
            </div>

            {/* 主导航 */}
            <div className="atlas-sidebar-nav-group">
                {mainNavItems.map(item => (
                    <NavButton key={item.id} item={item} />
                ))}
            </div>

            {/* 分割线 */}
            <div className="atlas-sidebar-divider" />

            {/* 模块标题 */}
            <p className="atlas-sidebar-module-title">
                {t('sidebar.modules', '模块')}
            </p>

            {/* 模块导航 */}
            <div className="atlas-sidebar-nav-group">
                {moduleItems.map(item => (
                    <NavButton key={item.id} item={item} isModule={true} />
                ))}
            </div>

            {/* 底部信息 */}
            <div className="atlas-sidebar-footer">
                <p className="atlas-sidebar-copyright">
                    {t('sidebar.copyright', '© 2026 Atlas')}<br />
                    {t('sidebar.allRightsReserved', 'All rights reserved')}
                </p>
            </div>
        </div>
    );
}

export default Sidebar;
