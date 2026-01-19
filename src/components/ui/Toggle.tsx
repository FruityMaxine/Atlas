/**
 * Toggle 开关组件
 * 
 * 用途：布尔值设置（开/关）
 * 特性：流畅动画、悬停效果、光晕反馈
 */

import { useState } from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: label ? '16px 20px' : '0',
            borderBottom: label ? '1px solid var(--border-secondary)' : 'none',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'auto',
        }}>
            {label && (
                <div>
                    <div style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {label}
                    </div>
                    {description && (
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {description}
                        </div>
                    )}
                </div>
            )}
            <div
                className="cursor-target"
                onClick={() => !disabled && onChange(!checked)}
                onMouseEnter={() => !disabled && setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                    width: '48px',
                    height: '26px',
                    background: checked ? 'var(--accent-primary)' : 'var(--bg-card-hover)',
                    border: '2px solid var(--border-primary)',  // 始终显示边框
                    borderRadius: '13px',
                    position: 'relative',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0,
                    marginLeft: label ? '16px' : '0',
                    boxShadow: isHovering
                        ? checked
                            ? '0 0 0 3px var(--accent-light)'
                            : '0 0 0 3px var(--border-primary)'
                        : 'none',
                    transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                }}
            >
                <div style={{
                    width: '20px',
                    height: '20px',
                    background: '#FFFFFF',  // 始终白色
                    borderRadius: '11px',
                    position: 'absolute',
                    top: '50%',  // 垂直居中
                    transform: checked ? 'translateY(-50%)' : 'translateY(-50%)',
                    left: checked ? '23px' : '2px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: checked
                        ? '0 3px 8px rgba(59, 130, 246, 0.4)'
                        : 'var(--shadow-sm)',
                }} />
            </div>
        </div>
    );
}
