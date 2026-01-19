/**
 * Input 输入框组件（增强版）
 * 
 * 用途：文本输入、密码输入、路径输入
 * 特性：聚焦效果、密码显示切换、占位符、描述文字
 */

import { useState } from 'react';

interface InputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    description?: string;
    type?: 'text' | 'password' | 'email' | 'number';
    disabled?: boolean;
    maxLength?: number;
}

export default function Input({
    label,
    value,
    onChange,
    placeholder,
    description,
    type = 'text',
    disabled = false,
    maxLength,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // 密码框的实际类型（支持切换显示）
    const actualType = type === 'password' && showPassword ? 'text' : type;
    const isPasswordField = type === 'password';

    return (
        <div style={{
            padding: label ? '16px 20px' : '0',
            borderBottom: label ? '1px solid var(--border-secondary)' : 'none',
        }}>
            {label && (
                <label style={{
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    display: 'block',
                    marginBottom: '8px',
                }}>
                    {label}
                </label>
            )}
            {description && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {description}
                </div>
            )}

            {/* 输入框容器 */}
            <div style={{ position: 'relative', width: '100%' }}>
                <input
                    className="cursor-target"
                    type={actualType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        width: '100%',
                        padding: isPasswordField ? '10px 40px 10px 12px' : '10px 12px',
                        fontSize: '14px',
                        background: 'var(--bg-card-hover)',
                        border: `1px solid ${isFocused ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        boxSizing: 'border-box',
                    }}
                />

                {/* 密码显示/隐藏切换按钮 */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: showPassword ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                            fontSize: '18px',
                            transition: 'color 0.2s ease',
                            opacity: disabled ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!disabled) {
                                e.currentTarget.style.color = 'var(--accent-primary)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!disabled && !showPassword) {
                                e.currentTarget.style.color = 'var(--text-tertiary)';
                            }
                        }}
                    >
                        {/* SVG 眼睛图标 */}
                        {showPassword ? (
                            // 眼睛睁开
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            // 眼睛闭合（斜线）
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
