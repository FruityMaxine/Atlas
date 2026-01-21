/**
 * Button 按钮组件（重构版）
 * 
 * 用途：执行操作
 * 特性：
 * - 深浅色主题完美适配
 * - 简约高级的现代化设计
 * - 流畅的交互动画
 * - 图标支持
 * - 可选的二次确认功能
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    /** 按钮文字 */
    label: string;
    /** 点击回调 */
    onClick: () => void;
    /** 变体：主要操作（蓝色）/ 危险操作（红色）*/
    variant?: 'primary' | 'danger';
    /** 图标组件 */
    icon?: LucideIcon;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否全宽 */
    fullWidth?: boolean;
    /** 尺寸 */
    size?: 'small' | 'medium' | 'large';
    /** 是否需要二次确认（默认 false）*/
    requireConfirm?: boolean;
    /** 确认对话框标题 */
    confirmTitle?: string;
    /** 确认对话框消息 */
    confirmMessage?: string;
    /** 确认按钮文本（默认"确认"）*/
    confirmButtonText?: string;
    /** 取消按钮文本（默认"取消"）*/
    cancelButtonText?: string;
}

export default function Button({
    label,
    onClick,
    variant = 'primary',
    icon,
    disabled = false,
    fullWidth = false,
    size = 'medium',
    requireConfirm = false,
    confirmTitle = '确认操作',
    confirmMessage = '确定要执行此操作吗？',
    confirmButtonText = '确认',
    cancelButtonText = '取消',
}: ButtonProps) {
    // 确认对话框状态
    const [showConfirm, setShowConfirm] = useState(false);

    // 动画状态管理
    const [shouldRenderConfirm, setShouldRenderConfirm] = useState(false);

    useEffect(() => {
        if (showConfirm) {
            setShouldRenderConfirm(true);
        } else {
            // 等待动画结束后再停止渲染
            const timer = setTimeout(() => setShouldRenderConfirm(false), 300);
            return () => clearTimeout(timer);
        }
    }, [showConfirm]);

    const isClosing = !showConfirm;

    // 获取当前主题
    const actualTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const isLightMode = actualTheme === 'light';

    // 点击处理逻辑
    const handleClick = () => {
        if (requireConfirm) {
            setShowConfirm(true); // 显示确认对话框
        } else {
            onClick(); // 直接执行
        }
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onClick(); // 用户确认后执行
    };

    const handleCancel = () => {
        setShowConfirm(false); // 用户取消
    };

    // 深色模式：毛玻璃效果（Glass Morphism）
    // 浅色模式：纯白背景
    const styles = {
        primary: {
            // 深色：毛玻璃半透明 + 灰色渐变
            // 浅色：纯白背景
            background: isLightMode
                ? '#FFFFFF'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',

            // 深色：微妙的白色光晕
            // 浅色：柔和的灰色阴影
            hoverBackground: isLightMode
                ? '#FFFFFF'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',

            hoverShadow: isLightMode
                ? '0 6px 16px rgba(0, 0, 0, 0.12)'
                : '0 4px 20px rgba(255, 255, 255, 0.1)',

            // 静态阴影
            staticShadow: isLightMode
                ? '0 2px 8px rgba(0, 0, 0, 0.12)'
                : '0 2px 12px rgba(0, 0, 0, 0.5)',

            // 边框
            border: isLightMode
                ? 'none'
                : '1px solid rgba(255, 255, 255, 0.1)',
        },
        danger: {
            // 危险按钮：红色半透明毛玻璃 + 渐变
            background: isLightMode
                ? '#FFFFFF'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(239, 68, 68, 0.12))',

            hoverBackground: isLightMode
                ? '#FFFFFF'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.28), rgba(239, 68, 68, 0.20))',

            hoverShadow: isLightMode
                ? '0 6px 16px rgba(0, 0, 0, 0.12)'
                : '0 4px 20px rgba(239, 68, 68, 0.2)',

            staticShadow: isLightMode
                ? '0 2px 8px rgba(0, 0, 0, 0.12)'
                : '0 2px 12px rgba(0, 0, 0, 0.5)',

            border: isLightMode
                ? 'none'
                : '1px solid rgba(239, 68, 68, 0.3)',
        },
    };

    const sizes = {
        small: { padding: '8px 16px', fontSize: '13px' },
        medium: { padding: '12px 24px', fontSize: '15px' },
        large: { padding: '16px 32px', fontSize: '16px' },
    };

    const currentStyle = styles[variant];

    return (
        <>
            <button
                className="cursor-target"
                onClick={handleClick}
                disabled={disabled}
                style={{
                    width: fullWidth ? '100%' : 'auto',
                    padding: sizes[size].padding,
                    fontSize: sizes[size].fontSize,
                    fontWeight: '600',

                    // 背景
                    background: disabled
                        ? 'var(--bg-card)'
                        : currentStyle.background,

                    // 毛玻璃效果
                    backdropFilter: disabled || isLightMode
                        ? 'none'
                        : 'blur(12px)',
                    WebkitBackdropFilter: disabled || isLightMode
                        ? 'none'
                        : 'blur(12px)',

                    // 边框
                    border: disabled
                        ? 'none'
                        : currentStyle.border,

                    borderRadius: '10px',

                    // 文字颜色
                    color: disabled
                        ? 'var(--text-tertiary)'
                        : isLightMode
                            ? '#1F2937'
                            : '#FFFFFF',

                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',

                    opacity: disabled ? 0.5 : 1,
                    position: 'relative',
                    overflow: 'hidden',

                    // 阴影
                    boxShadow: disabled
                        ? 'none'
                        : currentStyle.staticShadow,
                }}
                onMouseEnter={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = currentStyle.hoverShadow;
                        e.currentTarget.style.background = currentStyle.hoverBackground;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = currentStyle.staticShadow;
                        e.currentTarget.style.background = currentStyle.background;
                    }
                }}
                onMouseDown={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                    }
                }}
                onMouseUp={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(1)';
                    }
                }}
            >
                {icon && (() => {
                    const IconComponent = icon;
                    return <IconComponent size={18} />;
                })()}
                {label}
            </button>

            {/* 确认对话框（使用 Portal，与 Modal.tsx 样式完全一致）*/}
            {shouldRenderConfirm && createPortal(
                <>
                    {/* 背景遮罩（磨砂效果）*/}
                    <div
                        onClick={handleCancel}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            zIndex: 9998,
                            animation: `${isClosing ? 'fadeOut' : 'fadeIn'} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                            pointerEvents: 'auto',
                        }}
                    />

                    {/* 确认对话框内容 */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '450px',
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-lg)',
                            border: '2px solid var(--border-primary)',
                            zIndex: 9999,
                            animation: `${isClosing ? 'modalSlideOut' : 'modalSlideIn'} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            pointerEvents: 'auto',
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
                            borderBottom: 'none',
                            background: 'var(--bg-card)',
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0,
                            }}>
                                {confirmTitle}
                            </h2>
                        </div>

                        {/* 消息内容 */}
                        <div style={{
                            padding: '28px',
                            background: 'var(--bg-card)',
                            color: 'var(--text-secondary)',
                            fontSize: '15px',
                            lineHeight: '1.6',
                        }}>
                            {confirmMessage}
                        </div>

                        {/* 按钮区域 */}
                        <div style={{
                            padding: '20px 28px',
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                            borderTop: 'none',
                            background: 'var(--bg-card)',
                        }}>
                            {/* 取消按钮 */}
                            <button
                                className="cursor-target"
                                onClick={handleCancel}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    background: 'var(--bg-card-hover)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '8px',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                {cancelButtonText}
                            </button>

                            {/* 确认按钮（根据 variant 决定颜色）*/}
                            <button
                                className="cursor-target"
                                onClick={handleConfirm}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    background: variant === 'danger'
                                        ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                                        : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: variant === 'danger'
                                        ? '0 2px 8px rgba(239, 68, 68, 0.3)'
                                        : '0 2px 8px rgba(59, 130, 246, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = variant === 'danger'
                                        ? '0 4px 12px rgba(239, 68, 68, 0.4)'
                                        : '0 4px 12px rgba(59, 130, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = variant === 'danger'
                                        ? '0 2px 8px rgba(239, 68, 68, 0.3)'
                                        : '0 2px 8px rgba(59, 130, 246, 0.3)';
                                }}
                            >
                                {confirmButtonText}
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
