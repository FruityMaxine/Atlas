/**
 * Button 按钮组件（重构版）
 * 
 * 用途：执行操作
 * 特性：
 * - 深浅色主题完美适配
 * - 简约高级的现代化设计
 * - 流畅的交互动画
 * - 图标支持
 */

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
}

export default function Button({
    label,
    onClick,
    variant = 'primary',
    icon,
    disabled = false,
    fullWidth = false,
    size = 'medium',
}: ButtonProps) {
    // 获取当前主题
    const actualTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const isLightMode = actualTheme === 'light';

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
                ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                : '0 2px 12px rgba(0, 0, 0, 0.4)',

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
                ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                : '0 2px 12px rgba(0, 0, 0, 0.4)',

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
        <button
            className="cursor-target"
            onClick={onClick}
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
    );
}
