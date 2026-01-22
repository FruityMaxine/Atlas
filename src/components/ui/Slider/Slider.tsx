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
import './Slider.css';

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
    };

    // 辅助函数：根据状态获取 className
    const getStatusClass = (baseClass: string) => {
        if (isDragging) return `${baseClass} dragging`;
        if (isHovering) return `${baseClass} hover`;
        return `${baseClass} default`;
    };

    return (
        <div className={`atlas-slider-container ${label ? 'has-label' : 'no-label'}`}>
            {/* 标签行 */}
            {label && (
                <div className="atlas-slider-header">
                    <label className="atlas-slider-label">
                        {label}
                    </label>
                    {mode === 'slider' && showValue && (
                        <span className={`atlas-slider-value ${isDragging ? 'dragging' : ''}`}>
                            {value}{unit}
                        </span>
                    )}
                </div>
            )}

            {/* 描述文字 */}
            {description && (
                <div className="atlas-slider-description">
                    {description}
                </div>
            )}

            {/* 主容器 */}
            <div className={`atlas-slider-wrapper ${mode === 'input' ? 'has-input' : ''}`}>
                {/* 滑块容器 */}
                <div
                    className="atlas-slider-track-container"
                    style={{
                        flex: mode === 'input' ? '1' : 'auto',
                        width: mode === 'input' ? 'auto' : '100%',
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* 轨道背景 */}
                    <div className="atlas-slider-track-bg" />

                    {/* 已填充部分 - 使用主题色 */}
                    <div
                        className={getStatusClass('atlas-slider-fill')}
                        style={{ width: `${percentage}%` }} // 动态宽度必须保留
                    />

                    {/* 隐藏的原生 input */}
                    <input
                        className="atlas-slider-native-input cursor-target"
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
                    />

                    {/* 滑块手柄 */}
                    <div
                        className={getStatusClass('atlas-slider-thumb')}
                        style={{ left: `calc(${percentage}% - 9px)` }} // 动态位置必须保留
                    />
                </div>

                {/* 输入框模式 */}
                {mode === 'input' && (
                    <div className="atlas-slider-input-wrapper">
                        <input
                            className="atlas-slider-number-input cursor-target"
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            style={{ padding: unit ? '0 32px 0 12px' : '0 12px' }} // padding 依赖 JS 变量
                        />
                        {unit && (
                            <span className="atlas-slider-input-unit">
                                {unit}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
