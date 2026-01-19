/**
 * 侧边栏组件 - 导航栏
 * 
 * 结构：
 * - 顶部：Logo
 * - 主导航：开始、设置
 * - 分割线
 * - 模块导航：爬虫、下载器、工具箱
 * 
 * Props:
 * - currentPage: 当前选中的页面 ID
 * - onNavigate: 页面切换回调函数
 */

import { Home, Palette, Settings, Bug, Download, Wrench, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    currentPage: string;
    onNavigate: (pageId: string) => void;
}

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { t } = useTranslation();

    // 主导航项（顶部）
    const mainNavItems = [
        { id: 'home', name: t('sidebar.home', '首页'), icon: Home },
        { id: 'components', name: t('sidebar.components', '组件演示'), icon: Palette },
        { id: 'settings', name: t('sidebar.settings', '系统设置'), icon: Settings },
    ];

    // 模块导航项（底部）
    const moduleItems = [
        { id: 'crawler', name: t('sidebar.crawler', '爬虫模块'), icon: Bug, color: '#3B82F6' },
        { id: 'downloader', name: t('sidebar.downloader', '下载器'), icon: Download, color: '#8B5CF6' },
        { id: 'tools', name: t('sidebar.tools', '工具箱'), icon: Wrench, color: '#10B981' },
    ];

    // 导航按钮组件（可复用）
    const NavButton = ({ item, isModule = false }: any) => {
        const isSelected = currentPage === item.id;

        return (
            <div
                className="cursor-target"
                onClick={() => onNavigate(item.id)}
                style={{
                    background: isSelected
                        ? 'var(--accent-light)'
                        : 'var(--bg-card)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    border: isSelected
                        ? `2px solid ${isModule ? item.color : '#3B82F6'}`
                        : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
                onMouseEnter={(e) => {
                    if (!isSelected) {
                        e.currentTarget.style.background = 'var(--bg-card-hover)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) {
                        e.currentTarget.style.background = 'var(--bg-card)';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }
                }}
            >
                {(() => {
                    const IconComponent = item.icon;
                    return <IconComponent size={20} />;
                })()}
                <span style={{
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: isSelected ? '600' : '400',
                }}>
                    {item.name}
                </span>
            </div>
        );
    };

    return (
        <div style={{
            width: '240px',
            height: '100vh',
            background: 'var(--bg-secondary)',
            padding: '24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Logo */}
            <div style={{
                marginBottom: '32px',
            }}>
                <h1 style={{
                    color: 'var(--text-primary)',
                    fontSize: '22px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <Zap size={28} />
                    Atlas
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    marginTop: '4px',
                }}>
                    {t('sidebar.version', 'Workbench v1.1')}
                </p>
            </div>

            {/* 主导航 */}
            <div style={{ marginBottom: '24px' }}>
                {mainNavItems.map(item => (
                    <NavButton key={item.id} item={item} />
                ))}
            </div>

            {/* 分割线 */}
            <div style={{
                height: '1px',
                background: 'var(--border-primary)',
                marginBottom: '24px',
            }} />

            {/* 模块标题 */}
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '12px',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
            }}>
                {t('sidebar.modules', '模块')}
            </p>

            {/* 模块导航 */}
            <div>
                {moduleItems.map(item => (
                    <NavButton key={item.id} item={item} isModule={true} />
                ))}
            </div>

            {/* 底部信息 */}
            <div style={{
                marginTop: 'auto',
                padding: '16px',
                background: 'var(--bg-card)',
                borderRadius: '12px',
                textAlign: 'center',
            }}>
                <p style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '12px',
                    lineHeight: '1.6',
                }}>
                    {t('sidebar.copyright', '© 2026 Atlas')}<br />
                    {t('sidebar.allRightsReserved', 'All rights reserved')}
                </p>
            </div>
        </div>
    );
}

export default Sidebar;
