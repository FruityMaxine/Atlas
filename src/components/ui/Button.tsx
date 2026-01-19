/**
 * Button 按钮组件（简化版）
 * 
 * 用途：执行操作
 * 特性：两种变体（主要/危险）、图标支持、现代化悬停效果
 * 设计理念：简洁专业，避免过多颜色造成视觉混乱
 */

import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'danger';  // 只保留两种：蓝色主要操作和红色危险操作
    icon?: LucideIcon;
    disabled?: boolean;
    fullWidth?: boolean;
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
    // 获取实际应用的主题（useTheme 已经处理了 auto 的逻辑）
    const actualTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    const isLightMode = actualTheme === 'light';

    const styles = {
        primary: {
            background: isLightMode
                ? '#FFFFFF'  // 浅色模式：纯白
                : 'linear-gradient(135deg, #3B82F6, #2563EB)',  // 深色模式：蓝色渐变
            hoverShadow: isLightMode
                ? '0 8px 20px rgba(0, 0, 0, 0.15)'  // 浅色模式：灰色阴影
                : '0 8px 20px rgba(59, 130, 246, 0.4)',  // 深色模式：蓝色阴影
            activeBrightness: 0.9,
        },
        danger: {
            background: isLightMode
                ? '#FFFFFF'  // 浅色模式：纯白
                : 'linear-gradient(135deg, #EF4444, #DC2626)',  // 深色模式：红色渐变
            hoverShadow: isLightMode
                ? '0 8px 20px rgba(0, 0, 0, 0.15)'  // 浅色模式：灰色阴影
                : '0 8px 20px rgba(239, 68, 68, 0.4)',  // 深色模式：红色阴影
            activeBrightness: 0.9,
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
                background: disabled ? 'linear-gradient(135deg, #b7b7b7ff, #929292ff)' : currentStyle.background,
                border: 'none',
                borderRadius: '10px',
                color: isLightMode ? '#1F2937' : '#FFFFFF',  // 浅色=黑字，深色=白字,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: disabled ? 0.6 : 1,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: disabled ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = currentStyle.hoverShadow;
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }
            }}
            onMouseDown={(e) => {
                if (!disabled) {
                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                    e.currentTarget.style.filter = `brightness(${currentStyle.activeBrightness})`;
                }
            }}
            onMouseUp={(e) => {
                if (!disabled) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.filter = 'brightness(1)';
                }
            }}
        >
            {/* 光泽效果 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s ease',
                pointerEvents: 'none',
            }} />

            {icon && (() => {
                const IconComponent = icon;
                return <IconComponent size={18} />;
            })()}
            {label}
        </button>
    );
}
