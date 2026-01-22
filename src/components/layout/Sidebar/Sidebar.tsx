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
import { useSettings } from '../../../contexts/SettingsContext';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
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

// 导航按钮组件 - 移至外部以避免在 Sidebar 渲染时被重新定义（解决闪烁的关键）
const NavButton = ({
    item,
    isSelected,
    onClick,
    isModule = false
}: {
    item: NavItem;
    isSelected: boolean;
    onClick: () => void;
    isModule?: boolean;
}) => {
    const IconComponent = item.icon;

    const dynamicStyle = isSelected && isModule && item.color
        ? { borderColor: item.color }
        : {};

    return (
        <motion.div
            layout="position"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{
                opacity: { duration: 0.3 },
                x: { duration: 0.3 },
                layout: { duration: 0.3, ease: "easeInOut" }
            }}
            className={`atlas-sidebar-nav-btn cursor-target ${isSelected ? 'active' : ''} ${isModule ? 'module-active' : ''}`}
            onClick={onClick}
            style={dynamicStyle}
        >
            <IconComponent size={20} />
            <span className="atlas-sidebar-nav-text">
                {item.name}
            </span>
        </motion.div>
    );
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { t } = useTranslation();
    const { enableComponentPage } = useSettings();

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

            {/* 主导航 - 使用 LayoutGroup 确保所有元素的布局变化同步 */}
            <LayoutGroup>
                <motion.div
                    layout="position"
                    className="atlas-sidebar-nav-group"
                >
                    {/* 首页 - 永久显示 */}
                    <NavButton
                        key="home"
                        item={{ id: 'home', name: t('sidebar.home', '首页'), icon: Home }}
                        isSelected={currentPage === 'home'}
                        onClick={() => onNavigate('home')}
                    />

                    {/* 组件演示项 - 根据设置条件渲染，位于首页和设置之间 */}
                    <AnimatePresence mode="popLayout">
                        {enableComponentPage && (
                            <NavButton
                                key="components"
                                item={{ id: 'components', name: t('sidebar.components', '组件演示'), icon: Palette }}
                                isSelected={currentPage === 'components'}
                                onClick={() => onNavigate('components')}
                            />
                        )}
                    </AnimatePresence>

                    {/* 设置 - 永久显示 */}
                    <NavButton
                        key="settings"
                        item={{ id: 'settings', name: t('sidebar.settings', '系统设置'), icon: Settings }}
                        isSelected={currentPage === 'settings'}
                        onClick={() => onNavigate('settings')}
                    />
                </motion.div>

                {/* 分割线 */}
                <motion.div
                    layout="position"
                    transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                    className="atlas-sidebar-divider"
                />

                {/* 模块标题 */}
                <motion.p
                    layout="position"
                    transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                    className="atlas-sidebar-module-title"
                >
                    {t('sidebar.modules', '模块')}
                </motion.p>

                {/* 模块导航 */}
                <motion.div
                    layout="position"
                    transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                    className="atlas-sidebar-nav-group"
                >
                    <NavButton
                        key="crawler"
                        item={{ id: 'crawler', name: t('sidebar.crawler', '爬虫模块'), icon: Bug, color: '#3B82F6' }}
                        isModule={true}
                        isSelected={currentPage === 'crawler'}
                        onClick={() => onNavigate('crawler')}
                    />
                    <NavButton
                        key="downloader"
                        item={{ id: 'downloader', name: t('sidebar.downloader', '下载器'), icon: Download, color: '#8B5CF6' }}
                        isModule={true}
                        isSelected={currentPage === 'downloader'}
                        onClick={() => onNavigate('downloader')}
                    />
                    <NavButton
                        key="tools"
                        item={{ id: 'tools', name: t('sidebar.tools', '工具箱'), icon: Wrench, color: '#10B981' }}
                        isModule={true}
                        isSelected={currentPage === 'tools'}
                        onClick={() => onNavigate('tools')}
                    />
                </motion.div>

                {/* 底部信息 */}
                <motion.div
                    layout="position"
                    transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                    className="atlas-sidebar-footer"
                >
                    <p className="atlas-sidebar-copyright">
                        {t('sidebar.copyright', '© 2026 Atlas')}<br />
                        {t('sidebar.allRightsReserved', 'All rights reserved')}
                    </p>
                </motion.div>
            </LayoutGroup>
        </div>
    );
}

export default Sidebar;
