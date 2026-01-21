import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { Toast, ToastType } from '../../../contexts/ToastContext';

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
    index: number; // Used for stacking effect
}

export function ToastItem({ toast, onRemove, index }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    // Auto dismiss logic is handled in Context, but we handle "drag to dismiss" or click to dismiss here ideally.
    // actually Context handles the removal timer.

    const handleClose = () => {
        setIsExiting(true);
        // Wait for animation to finish then remove
        setTimeout(() => onRemove(toast.id), 300);
    };

    const icons = {
        success: <CheckCircle size={20} color="#10B981" />,
        error: <AlertCircle size={20} color="#EF4444" />,
        warning: <AlertTriangle size={20} color="#F59E0B" />,
        info: <Info size={20} color="#3B82F6" />,
    };

    // const colors = { ... } (Removed unused)

    // const actualTheme = document.documentElement.getAttribute('data-theme');
    // const isLight = actualTheme === 'light';

    return (
        <div
            style={{
                marginBottom: '12px',
                width: '356px',
                background: 'var(--bg-card)', // Use CSS var from theme
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                overflow: 'hidden',
                pointerEvents: 'all',
                cursor: 'default',
                // Animation
                animation: isExiting
                    ? 'toastSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                    : 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: isExiting ? '0s' : `${index * 0.05}s`,
                transformOrigin: 'bottom right',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateX(-4px)';
            }}
            onMouseLeave={(e) => {
                // We rely on animation class/style, but hover effects interfere with transform animation?
                // Actually `toastSlideIn` ends at `transform: translateX(0)`.
                // Hover effect might conflict. Let's keep it simple or use !important or better, use a wrapper.
                e.currentTarget.style.transform = 'scale(1) translateX(0)';
            }}
        >
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(100%) scale(0.9); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes toastSlideOut {
                    from { opacity: 1; transform: translateX(0) scale(1); }
                    to { opacity: 0; transform: translateX(20%) scale(0.95); }
                }
            `}</style>

            {/* Icon */}
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {icons[toast.type]}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    lineHeight: '1.4',
                }}>
                    {toast.type === 'error' ? 'Error' :
                        toast.type === 'success' ? 'Success' :
                            toast.type === 'warning' ? 'Warning' : 'Info'}
                </h4>
                <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                }}>
                    {toast.message}
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={handleClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    margin: '-4px',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
            >
                <X size={16} />
            </button>

            {/* Progress Bar (Optional, can be added later) */}
        </div>
    );
}
