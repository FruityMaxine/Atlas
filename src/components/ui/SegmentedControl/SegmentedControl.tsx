/**
 * SegmentedControl 分段控制器组件
 * 
 * 用途：三段式选择（必须选一个，类似iOS的SegmentedControl）
 * 特性：滑动动画、3个或更多选项
 */

import { useState } from 'react';
import './SegmentedControl.css';

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
        <div className={`atlas-segmented-container ${label ? 'has-label' : 'no-label'}`}>
            {label && (
                <label className="atlas-segmented-label">
                    {label}
                </label>
            )}
            {description && (
                <div className="atlas-segmented-desc">
                    {description}
                </div>
            )}
            <div className="atlas-segmented-track">
                {/* 滑动背景 (Indicator) */}
                <div
                    className="atlas-segmented-indicator"
                    style={{
                        left: `calc(${selectedIndex * (100 / options.length)}% + 4px)`,
                        width: `calc(${100 / options.length}% - 8px)`,
                    }}
                />

                {/* 选项按钮 */}
                {options.map((option, index) => {
                    const isSelected = option.value === value;
                    const isHovered = hoveredIndex === index;

                    // 构建 className
                    let itemClass = 'atlas-segmented-item cursor-target';
                    if (isSelected) itemClass += ' selected';
                    if (isHovered && !isSelected) itemClass += ' hover-effect';

                    return (
                        <button
                            className={itemClass}
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
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
