/**
 * Slider 滑块组件（重构版）
 * 
 * 用途：数值调节（音量、亮度等）
 * 特性：
 * - 完美适配深浅色主题
 * - 流畅动画与交互反馈
 * - 支持两种模式：纯滑块模式 / 滑块+输入框模式
 * - 优雅的现代化设计
 */

import { useState } from 'react';

interface SliderProps {
    /** 标签文字 */
    label?: string;
    /** 当前值 */
    value: number;
    /** 值变化回调 */
    onChange: (value: number) => void;
    /** 最小值（默认 0）*/
    min?: number;
    /** 最大值（默认 100）*/
    max?: number;
    /** 步长（默认 1）*/
    step?: number;
    /** 单位（如 '%', 'ms'）*/
    unit?: string;
    /** 描述文字 */
    description?: string;
    /** 是否显示数值（默认 true）*/
    showValue?: boolean;
    /** 模式：'slider' 纯滑块 | 'input' 滑块+输入框（默认 'slider'）*/
    mode?: 'slider' | 'input';
}

export default function Slider({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    description,
    showValue = true,
    mode = 'slider',
}: SliderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());

    const percentage = ((value - min) / (max - min)) * 100;

    // 处理输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
            // 限制在范围内
            const clampedValue = Math.max(min, Math.min(max, numValue));
            onChange(clampedValue);
        }
    };

    // 输入框失焦时同步值
    const handleInputBlur = () => {
        const numValue = parseFloat(inputValue);
        if (isNaN(numValue)) {
            setInputValue(value.toString());
        } else {
            const clampedValue = Math.max(min, Math.min(max, numValue));
            onChange(clampedValue);
            setInputValue(clampedValue.toString());
        }
        setIsFocused(false);
    };

    return (
        <div style={{
            padding: label ? '16px 20px' : '0',
            borderBottom: label ? '1px solid var(--border-secondary)' : 'none',
        }}>
            {/* 标签行 */}
            {label && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                }}>
                    <label style={{
                        fontSize: '15px',
                        color: 'var(--text-primary)',
                        fontWeight: '500',
                    }}>
                        {label}
                    </label>
                    {mode === 'slider' && showValue && (
                        <span style={{
                            fontSize: '14px',
                            color: 'var(--accent-primary)',
                            fontWeight: '600',
                            fontVariantNumeric: 'tabular-nums',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isDragging ? 'scale(1.08)' : 'scale(1)',
                        }}>
                            {value}{unit}
                        </span>
                    )}
                </div>
            )}

            {/* 描述文字 */}
            {description && (
                <div style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                }}>
                    {description}
                </div>
            )}

            {/* 主容器 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: mode === 'input' ? '16px' : '0',
            }}>
                {/* 滑块容器 */}
                <div
                    style={{
                        position: 'relative',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        flex: mode === 'input' ? '1' : 'auto',
                        width: mode === 'input' ? 'auto' : '100%',
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* 轨道背景 */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '4px',
                        background: 'var(--bg-card-hover)',
                        borderRadius: '2px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />

                    {/* 已填充部分 - 使用主题色 */}
                    <div style={{
                        position: 'absolute',
                        width: `${percentage}%`,
                        height: isHovering || isDragging ? '5px' : '4px',
                        background: 'var(--accent-primary)',
                        borderRadius: '2.5px',
                        transition: isDragging
                            ? 'height 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                            : 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isDragging
                            ? '0 0 16px var(--accent-light), 0 2px 8px rgba(0, 0, 0, 0.2)'
                            : isHovering
                                ? '0 0 8px var(--accent-light)'
                                : 'none',
                    }} />

                    {/* 隐藏的原生 input */}
                    <input
                        className="cursor-target"
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            onChange(newValue);
                            setInputValue(newValue.toString());
                        }}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '32px',
                            margin: 0,
                            padding: 0,
                            cursor: 'pointer',
                            opacity: 0,
                            zIndex: 2,
                        }}
                    />

                    {/* 滑块手柄 */}
                    <div style={{
                        position: 'absolute',
                        left: `calc(${percentage}% - 9px)`,
                        width: '18px',
                        height: '18px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '9px',
                        border: '3px solid var(--accent-primary)',
                        boxShadow: isDragging
                            ? '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 4px var(--accent-light)'
                            : isHovering
                                ? '0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 3px var(--accent-light)'
                                : '0 2px 6px rgba(0, 0, 0, 0.15)',
                        transition: isDragging
                            ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                            : 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isDragging
                            ? 'scale(1.25)'
                            : isHovering
                                ? 'scale(1.1)'
                                : 'scale(1)',
                        zIndex: 1,
                    }} />
                </div>

                {/* 输入框模式 */}
                {mode === 'input' && (
                    <div style={{
                        position: 'relative',
                        width: '100px',
                        flexShrink: 0,
                    }}>
                        <input
                            className="cursor-target"
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onFocus={() => setIsFocused(true)}
                            style={{
                                width: '100%',
                                height: '36px',
                                padding: unit ? '0 32px 0 12px' : '0 12px',
                                fontSize: '14px',
                                fontWeight: '500',
                                fontVariantNumeric: 'tabular-nums',
                                color: 'var(--text-primary)',
                                background: 'var(--bg-card)',
                                border: `2px solid ${isFocused ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isFocused
                                    ? '0 0 0 3px var(--accent-light)'
                                    : 'none',
                            }}
                        />
                        {unit && (
                            <span style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                pointerEvents: 'none',
                                fontWeight: '500',
                            }}>
                                {unit}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
