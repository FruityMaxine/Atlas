/**
 * SegmentedControl 分段控制器组件
 * 
 * 用途：三段式选择（必须选一个，类似iOS的SegmentedControl）
 * 特性：滑动动画、3个或更多选项
 */

import { useState } from 'react';

interface SegmentOption {
    value: string;
    label: string;
    icon?: string;
}

interface SegmentedControlProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SegmentOption[];
    description?: string;
}

export default function SegmentedControl({
    label,
    value,
    onChange,
    options,
    description,
}: SegmentedControlProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const selectedIndex = options.findIndex(opt => opt.value === value);

    return (
        <div style={{
            padding: label ? '16px 20px' : '0',
            borderBottom: label ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
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
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                    {description}
                </div>
            )}
            <div style={{
                display: 'flex',
                background: 'var(--bg-card-hover)',
                borderRadius: '10px',
                padding: '4px',
                position: 'relative',
            }}>
                {/* 滑动背景 */}
                <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: `calc(${selectedIndex * (100 / options.length)}% + 4px)`,
                    width: `calc(${100 / options.length}% - 8px)`,
                    height: 'calc(100% - 8px)',
                    background: '#3B82F6',
                    borderRadius: '8px',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                }} />

                {/* 选项按钮 */}
                {options.map((option, index) => {
                    const isSelected = option.value === value;
                    const isHovered = hoveredIndex === index;

                    return (
                        <button
                            className="cursor-target"
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                fontSize: '14px',
                                fontWeight: isSelected ? '600' : '400',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transform: isHovered && !isSelected ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
