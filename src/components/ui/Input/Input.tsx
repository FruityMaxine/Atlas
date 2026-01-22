/**
 * Input 输入框组件（增强版）
 * 
 * 用途：文本输入、密码输入、路径输入
 * 特性：聚焦效果、密码显示切换、占位符、描述文字
 */

import { useState } from 'react';
import './Input.css';

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

    // 密码框的实际类型（支持切换显示）
    const actualType = type === 'password' && showPassword ? 'text' : type;
    const isPasswordField = type === 'password';

    return (
        <div className={`atlas-input-container ${label ? 'has-label' : 'no-label'}`}>
            {label && (
                <label className="atlas-input-label">
                    {label}
                </label>
            )}
            {description && (
                <div className="atlas-input-desc">
                    {description}
                </div>
            )}

            {/* 输入框容器 */}
            <div className="atlas-input-wrapper">
                <input
                    className={`atlas-input-field cursor-target ${isPasswordField ? 'password' : ''}`}
                    type={actualType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                />

                {/* 密码显示/隐藏切换按钮 */}
                {isPasswordField && (
                    <button
                        className={`atlas-input-toggle-btn ${showPassword ? 'active' : ''}`}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
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
