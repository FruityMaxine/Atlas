/**
 * Button 按钮组件（重构版）
 * 
 * 用途：执行操作
 * 特性：
 * - 深浅色主题完美适配
 * - 简约高级的现代化设计
 * - 流畅的交互动画
 * - 图标支持
 * - 可选的二次确认功能
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from 'lucide-react';
import './Button.css';

interface ButtonProps {
    /** 按钮文字 */
    label: string;
    /** 点击回调 */
    onClick: () => void;
    /** 变体：主要操作（蓝色）/ 危险操作（红色）*/
    variant?: 'primary' | 'danger';
    /** 图标组件 */
    icon?: LucideIcon;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否全宽 */
    fullWidth?: boolean;
    /** 尺寸 */
    size?: 'small' | 'medium' | 'large';
    /** 是否需要二次确认（默认 false）*/
    requireConfirm?: boolean;
    /** 确认对话框标题 */
    confirmTitle?: string;
    /** 确认对话框消息 */
    confirmMessage?: string;
    /** 确认按钮文本（默认"确认"）*/
    confirmButtonText?: string;
    /** 取消按钮文本（默认"取消"）*/
    cancelButtonText?: string;
    /** 是否正在加载 */
    isLoading?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export default function Button({
    label,
    onClick,
    variant = 'primary',
    icon,
    disabled = false,
    isLoading = false,
    fullWidth = false,
    size = 'medium',
    requireConfirm = false,
    confirmTitle = '确认操作',
    confirmMessage = '确定要执行此操作吗？',
    confirmButtonText = '确认',
    cancelButtonText = '取消',
    style,
    className = '',
}: ButtonProps) {
    // 确认对话框状态
    const [showConfirm, setShowConfirm] = useState(false);

    // 动画状态管理
    const [shouldRenderConfirm, setShouldRenderConfirm] = useState(false);

    useEffect(() => {
        if (showConfirm) {
            setShouldRenderConfirm(true);
        } else {
            // 等待动画结束后再停止渲染
            const timer = setTimeout(() => setShouldRenderConfirm(false), 300);
            return () => clearTimeout(timer);
        }
    }, [showConfirm]);

    const isClosing = !showConfirm;
    const isDisabled = disabled || isLoading;

    // 点击处理逻辑
    const handleClick = () => {
        if (isDisabled) return;

        if (requireConfirm) {
            setShowConfirm(true); // 显示确认对话框
        } else {
            onClick(); // 直接执行
        }
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onClick(); // 用户确认后执行
    };

    const handleCancel = () => {
        setShowConfirm(false); // 用户取消
    };

    return (
        <>
            <button
                className={`atlas-btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className} cursor-target`}
                onClick={handleClick}
                disabled={isDisabled}
                style={style}
            >
                {isLoading ? (
                    <div className="atlas-btn-spinner" />
                ) : (
                    icon && (() => {
                        const IconComponent = icon;
                        return <IconComponent size={18} />;
                    })()
                )}
                {label}
            </button>

            {/* 确认对话框（使用 Portal）*/}
            {shouldRenderConfirm && createPortal(
                <>
                    {/* 背景遮罩 */}
                    <div
                        className={`atlas-modal-overlay ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                        onClick={handleCancel}
                    />

                    {/* 确认对话框内容 */}
                    <div
                        className={`atlas-confirm-modal ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 标题栏 */}
                        <div className="atlas-confirm-header">
                            <h2 className="atlas-confirm-title">
                                {confirmTitle}
                            </h2>
                        </div>

                        {/* 消息内容 */}
                        <div className="atlas-confirm-body">
                            {confirmMessage}
                        </div>

                        {/* 按钮区域 */}
                        <div className="atlas-confirm-footer">
                            {/* 取消按钮 */}
                            <button
                                className="atlas-confirm-btn-cancel cursor-target"
                                onClick={handleCancel}
                            >
                                {cancelButtonText}
                            </button>

                            {/* 确认按钮 */}
                            <button
                                className={`atlas-confirm-btn-confirm ${variant === 'danger' ? 'danger' : ''} cursor-target`}
                                onClick={handleConfirm}
                            >
                                {confirmButtonText}
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
