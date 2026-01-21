/**
 * Select 下拉框组件（自定义版本 + Portal）
 * 
 * 用途：单选、预设选项
 * 特性：自定义下拉列表、流畅动画、现代化样式
 * 修复：使用 Portal 解决父容器 overflow:hidden 遮挡问题
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
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
        setHoveredValue(null);
    };

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
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {description}
                </div>
            )}

            {/* 自定义下拉框容器 */}
            <div
                ref={selectRef}
                style={{
                    position: 'relative',
                    width: '100%',
                }}
            >
                {/* 选择框按钮 */}
                <button
                    className="cursor-target"
                    ref={buttonRef}
                    onClick={() => {
                        if (!disabled) {
                            updateButtonPosition();
                            setIsOpen(!isOpen);
                        }
                    }}
                    disabled={disabled}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        background: isOpen
                            ? 'var(--accent-light)'
                            : 'var(--bg-card-hover)',
                        border: `2px solid ${isOpen ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                        opacity: disabled ? 0.5 : 1,
                    }}
                >
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        {selectedOption?.icon && <span>{selectedOption.icon}</span>}
                        {selectedOption?.label || '请选择...'}
                    </span>
                    {/* 下拉箭头 */}
                    <span style={{
                        fontSize: '12px',
                        color: isOpen ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                        transition: 'transform 0.3s ease, color 0.2s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>
                        ▼
                    </span>
                </button>

                {/* 使用 Portal 渲染下拉选项列表到 body，避免被父容器裁剪 */}
                {isOpen && buttonRect && createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'fixed',
                            top: `${buttonRect.bottom + 4}px`,
                            left: `${buttonRect.left}px`,
                            width: `${buttonRect.width}px`,

                            // 毛玻璃效果 - 使用专用主题变量
                            background: 'var(--dropdown-bg)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',

                            border: '1px solid var(--border-primary)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            zIndex: 9999,
                            boxShadow: 'var(--shadow-lg)',
                            animation: 'selectDropdown 0.2s ease-out',
                            maxHeight: '280px',
                            overflowY: 'auto',
                        }}
                    >
                        {/* 注入动画样式 */}
                        <style>{`
                            @keyframes selectDropdown {
                                from {
                                    opacity: 0;
                                    transform: translateY(-10px) scale(0.95);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0) scale(1);
                                }
                            }
                            
                            /* 自定义滚动条 */
                            div[style*="overflowY: auto"]::-webkit-scrollbar {
                                width: 6px;
                            }
                            
                            div[style*="overflowY: auto"]::-webkit-scrollbar-track {
                                background: var(--bg-secondary);
                            }
                            
                            div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
                                background: var(--text-tertiary);
                                border-radius: 3px;
                            }
                            
                            div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
                                background: var(--text-secondary);
                            }
                        `}</style>

                        {options.map((option, index) => {
                            const isSelected = option.value === value;
                            const isHovered = hoveredValue === option.value;

                            return (
                                <button
                                    className="cursor-target"
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    onMouseEnter={() => setHoveredValue(option.value)}
                                    onMouseLeave={() => setHoveredValue(null)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        fontSize: '14px',
                                        background: isSelected
                                            ? 'var(--dropdown-option-selected)'
                                            : isHovered
                                                ? 'var(--dropdown-option-hover)'
                                                : 'transparent',
                                        border: 'none',
                                        borderTop: index === 0 ? 'none' : '1px solid var(--border-secondary)',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '8px',
                                        transition: 'all 0.15s ease',
                                        fontWeight: isSelected ? '600' : '400',
                                    }}
                                >
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        {option.icon && <span>{option.icon}</span>}
                                        {option.label}
                                    </span>
                                    {/* 选中标记 */}
                                    {isSelected && (
                                        <span style={{
                                            fontSize: '16px',
                                            color: 'var(--accent-primary)',
                                        }}>
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
