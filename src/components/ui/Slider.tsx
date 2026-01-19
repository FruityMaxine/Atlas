/**
 * Slider 滑块组件（现代化版本）
 * 
 * 用途：数值调节（音量、亮度等）
 * 特性：流畅动画、渐变滑块、现代化设计
 */

import { useState } from 'react';

interface SliderProps {
    label?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    description?: string;
    showValue?: boolean;
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
}: SliderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div style={{
            padding: label ? '16px 20px' : '0',
            borderBottom: label ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        }}>
            {label && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                }}>
                    <label style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                        {label}
                    </label>
                    {showValue && (
                        <span style={{
                            fontSize: '14px',
                            color: '#3B82F6',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                        }}>
                            {value}{unit}
                        </span>
                    )}
                </div>
            )}
            {description && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {description}
                </div>
            )}
            <div
                style={{ position: 'relative', height: '32px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* 轨道背景 - 使用纯灰色背景 */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    background: 'var(--bg-card-hover)',
                    borderRadius: '3px',
                    transition: 'height 0.2s ease',
                }} />

                {/* 已填充部分 - 渐变效果 */}
                <div style={{
                    position: 'absolute',
                    width: `${percentage}%`,
                    height: isHovering || isDragging ? '6px' : '4px',
                    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                    borderRadius: '3px',
                    transition: isDragging ? 'height 0.2s ease' : 'width 0.2s ease, height 0.2s ease',
                    boxShadow: isDragging
                        ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)'
                        : isHovering
                            ? '0 0 10px rgba(59, 130, 246, 0.4)'
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
                    onChange={(e) => onChange(Number(e.target.value))}
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

                {/* 现代化滑块圆点 */}
                <div style={{
                    position: 'absolute',
                    left: `calc(${percentage}% - 10px)`,
                    width: '20px',
                    height: '20px',
                    background: 'linear-gradient(135deg, #60A5FA, #A78BFA)',
                    borderRadius: '10px',
                    border: '2px solid #1A1B26',
                    boxShadow: isDragging
                        ? '0 6px 20px rgba(59, 130, 246, 0.6), 0 0 0 6px rgba(59, 130, 246, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3)'
                        : isHovering
                            ? '0 4px 12px rgba(59, 130, 246, 0.4), 0 0 0 4px rgba(59, 130, 246, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.2)'
                            : '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)',
                    transition: isDragging ? 'box-shadow 0.2s ease' : 'left 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                    transform: isDragging
                        ? 'scale(1.3)'
                        : isHovering
                            ? 'scale(1.15)'
                            : 'scale(1)',
                    zIndex: 1,
                }}>
                    {/* 内部光晕效果 */}
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        width: '8px',
                        height: '8px',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)',
                        borderRadius: '4px',
                        opacity: isDragging ? 1 : 0.6,
                        transition: 'opacity 0.2s ease',
                    }} />
                </div>
            </div>
        </div>
    );
}
