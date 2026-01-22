/**
 * Select 下拉框组件（自定义版本 + Portal）
 * 
 * 用途：单选、预设选项
 * 特性：自定义下拉列表、流畅动画、现代化样式
 * 修复：使用 Portal 解决父容器 overflow:hidden 遮挡问题
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Select.css';

interface SelectOption {
    value: string;
    label: string;
    icon?: string; // 可选图标
}

interface SelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    description?: string;
    disabled?: boolean;
}

export default function Select({
    label,
    value,
    onChange,
    options,
    description,
    disabled = false,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null); // Portal 下拉框 ref

    // 当前选中的选项
    const selectedOption = options.find(opt => opt.value === value);

    // 更新按钮位置（用于 Portal 定位）
    const updateButtonPosition = () => {
        if (buttonRef.current) {
            setButtonRect(buttonRef.current.getBoundingClientRect());
        }
    };

    // 点击外部关闭下拉框（修复 Portal 版本）
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // 检查是否点击在按钮或下拉框外部
            if (
                selectRef.current && !selectRef.current.contains(target) &&
                dropdownRef.current && !dropdownRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // 监听滚动和窗口大小变化，实时更新下拉框位置
    useEffect(() => {
        if (!isOpen) return;

        const handleScrollOrResize = () => {
            updateButtonPosition();
        };

        // 监听滚动（包括所有父元素滚动）
        window.addEventListener('scroll', handleScrollOrResize, true);
        // 监听窗口大小变化
        window.addEventListener('resize', handleScrollOrResize);

        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`atlas-select-container ${label ? 'has-label' : 'no-label'}`}>
            {label && (
                <label className="atlas-select-label">
                    {label}
                </label>
            )}
            {description && (
                <div className="atlas-select-description">
                    {description}
                </div>
            )}

            {/* 自定义下拉框容器 */}
            <div
                ref={selectRef}
                className="atlas-select-wrapper"
            >
                {/* 选择框按钮 */}
                <button
                    className={`atlas-select-trigger cursor-target ${isOpen ? 'open' : ''}`}
                    ref={buttonRef}
                    onClick={() => {
                        if (!disabled) {
                            updateButtonPosition();
                            setIsOpen(!isOpen);
                        }
                    }}
                    disabled={disabled}
                >
                    <span className="atlas-select-value">
                        {selectedOption?.icon && <span>{selectedOption.icon}</span>}
                        {selectedOption?.label || '请选择...'}
                    </span>
                    {/* 下拉箭头 */}
                    <span className="atlas-select-arrow">
                        ▼
                    </span>
                </button>

                {/* 使用 Portal 渲染下拉选项列表到 body，避免被父容器裁剪 */}
                {isOpen && buttonRect && createPortal(
                    <div
                        ref={dropdownRef}
                        className="atlas-select-dropdown"
                        style={{
                            // 动态位置仍需保留在内联样式中
                            top: `${buttonRect.bottom + 4}px`,
                            left: `${buttonRect.left}px`,
                            width: `${buttonRect.width}px`,
                        }}
                    >
                        {options.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    className={`atlas-select-option cursor-target ${isSelected ? 'selected' : ''}`}
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span className="atlas-select-option-content">
                                        {option.icon && <span>{option.icon}</span>}
                                        {option.label}
                                    </span>
                                    {/* 选中标记 */}
                                    {isSelected && (
                                        <span className="atlas-select-check">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
}
