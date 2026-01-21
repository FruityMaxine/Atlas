/**
 * Modal 模态对话框组件 + SettingItem 设置项组件
 * 
 * Modal: 悬浮弹窗，显示详细内容
 * SettingItem: 可点击列表项，自动打开 Modal
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
    showCloseButton?: boolean; // 是否显示关闭按钮
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '600px',
    showCloseButton = true, // 默认显示
}: ModalProps) {
    // ESC 键关闭
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // 动画状态管理
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            // 等待动画结束后再停止渲染
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const isClosing = !isOpen;

    return createPortal(
        <>
            {/* 背景遮罩（磨砂效果） */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)', // 磨砂效果
                    WebkitBackdropFilter: 'blur(8px)', // Safari 支持
                    zIndex: 9998,
                    animation: `${isClosing ? 'fadeOut' : 'fadeIn'} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    pointerEvents: 'auto', // 确保可以点击
                }}
            />

            {/* 弹窗内容 */}
            <div
                onClick={(e) => e.stopPropagation()} // 阻止事件冒泡到遮罩层
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: maxWidth,
                    maxHeight: '85vh',
                    background: 'var(--bg-secondary)', // 主体背景：深色模式为极深灰，浅色模式为纯白
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '2px solid var(--border-primary)',
                    zIndex: 9999,
                    animation: `${isClosing ? 'modalSlideOut' : 'modalSlideIn'} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto', // 确保内容可交互
                }}
            >
                {/* 动画样式 */}
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    
                    @keyframes modalSlideIn {
                        from {
                            opacity: 0;
                            transform: translate(-50%, -45%) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translate(-50%, -50%) scale(1);
                        }
                    }

                    @keyframes modalSlideOut {
                        from {
                            opacity: 1;
                            transform: translate(-50%, -50%) scale(1);
                        }
                        to {
                            opacity: 0;
                            transform: translate(-50%, -45%) scale(0.95);
                        }
                    }
                `}</style>

                {/* 标题栏 */}
                <div style={{
                    padding: '24px 28px',
                    borderBottom: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)', // 浅色模式下为浅灰，深色模式为中深灰
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0,
                    }}>
                        {title}
                    </h2>

                    {/* 关闭按钮（可选） */}
                    {showCloseButton && (
                        <button
                            className="cursor-target"
                            onClick={onClose}
                            style={{
                                background: 'var(--bg-card-hover)',
                                border: 'none',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: 'var(--text-tertiary)',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                e.currentTarget.style.color = '#EF4444';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--bg-card-hover)';
                                e.currentTarget.style.color = 'var(--text-tertiary)';
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* 内容区域（可滚动） */}
                <div style={{
                    padding: '28px',
                    overflowY: 'auto',
                    flex: 1,
                    background: 'var(--bg-primary)', // 改为主背景色，深色模式为深灰 #18181B
                }}>
                    {children}
                </div>
            </div>
        </>,
        document.body
    );
}

// ========== SettingItem 组件（集成在同一文件中） ==========

import { LucideIcon } from 'lucide-react';

interface SettingItemProps {
    label: string;
    description?: string;
    icon?: LucideIcon;
    children: React.ReactNode; // Modal 内容
    modalTitle?: string; // Modal 标题（默认使用 label）
    showCloseButton?: boolean; // 是否显示 Modal 关闭按钮
}

export function SettingItem({
    label,
    description,
    icon,
    children,
    modalTitle,
    showCloseButton = true,
}: SettingItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* 可点击的列表项 */}
            <div
                className="cursor-target"
                onClick={() => setIsOpen(true)}
                style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease', // 只过渡背景色
                    background: 'transparent',
                    position: 'relative',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                {/* 左侧：图标 + 文字（添加悬停动画） */}
                <div
                    className="setting-item-content"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: 1,
                        transition: 'transform 0.2s ease',
                    }}
                >
                    {icon && (() => {
                        const IconComponent = icon;
                        return <IconComponent size={20} color='var(--text-primary)' />;
                    })()}
                    <div>
                        <div style={{
                            fontSize: '15px',
                            color: 'var(--text-primary)',
                            fontWeight: '500',
                            marginBottom: description ? '4px' : '0',
                        }}>
                            {label}
                        </div>
                        {description && (
                            <div style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                            }}>
                                {description}
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧：箭头（添加独立悬停动画） */}
                <div
                    className="setting-item-arrow"
                    style={{
                        fontSize: '20px',
                        color: 'var(--text-tertiary)',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    {'>'}
                </div>

                {/* CSS 样式：只在悬停时移动内容 */}
                <style>{`
                    .setting-item-content:hover,
                    div:hover > .setting-item-content {
                        transform: translateX(4px);
                    }
                    
                    .setting-item-arrow:hover,
                    div:hover > .setting-item-arrow {
                        transform: translateX(4px);
                    }
                `}</style>
            </div>

            {/* Modal 弹窗 */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={modalTitle || label}
                showCloseButton={showCloseButton}
            >
                {children}
            </Modal>
        </>
    );
}

// 默认导出 Modal，同时导出 SettingItem
export default Modal;
