/**
 * Modal 模态对话框组件 + SettingItem 设置项组件
 * 
 * Modal: 悬浮弹窗，显示详细内容
 * SettingItem: 可点击列表项，自动打开 Modal
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from 'lucide-react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
    showCloseButton?: boolean; // 是否显示关闭按钮
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '600px',
    showCloseButton = true, // 默认显示
}: ModalProps) {
    // ESC 键关闭
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // 动画状态管理
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            // 等待动画结束后再停止渲染
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const isClosing = !isOpen;

    return createPortal(
        <>
            {/* 背景遮罩（磨砂效果） */}
            <div
                className={`atlas-modal-overlay ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={onClose}
            />

            {/* 弹窗内容 */}
            <div
                className={`atlas-modal-container ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
                onClick={(e) => e.stopPropagation()} // 阻止事件冒泡到遮罩层
                style={{ maxWidth: maxWidth }} // 动态宽度仍需保留
            >
                {/* 标题栏 */}
                <div className="atlas-modal-header">
                    <h2 className="atlas-modal-title">
                        {title}
                    </h2>

                    {/* 关闭按钮（可选） */}
                    {showCloseButton && (
                        <button
                            className="atlas-modal-close-btn cursor-target"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* 内容区域（可滚动） */}
                <div className="atlas-modal-content">
                    {children}
                </div>
            </div>
        </>,
        document.body
    );
}

// ========== SettingItem 组件（集成在同一文件中） ==========

interface SettingItemProps {
    label: string;
    description?: string;
    icon?: LucideIcon;
    children: React.ReactNode; // Modal 内容
    modalTitle?: string; // Modal 标题（默认使用 label）
    showCloseButton?: boolean; // 是否显示 Modal 关闭按钮
}

export function SettingItem({
    label,
    description,
    icon,
    children,
    modalTitle,
    showCloseButton = true,
}: SettingItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* 可点击的列表项 */}
            <div
                className="atlas-setting-item cursor-target"
                onClick={() => setIsOpen(true)}
            >
                {/* 左侧：图标 + 文字 */}
                <div className="atlas-setting-content">
                    {icon && (() => {
                        const IconComponent = icon;
                        return <IconComponent size={20} color='var(--text-primary)' />;
                    })()}
                    <div className="atlas-setting-info">
                        <div className={`atlas-setting-label ${description ? 'has-desc' : 'no-desc'}`}>
                            {label}
                        </div>
                        {description && (
                            <div className="atlas-setting-desc">
                                {description}
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧：箭头 */}
                <div className="atlas-setting-arrow">
                    {'>'}
                </div>
            </div>

            {/* Modal 弹窗 */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={modalTitle || label}
                showCloseButton={showCloseButton}
            >
                {children}
            </Modal>
        </>
    );
}

export default Modal;
