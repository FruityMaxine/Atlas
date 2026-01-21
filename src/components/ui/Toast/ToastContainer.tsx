import React from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '../../../contexts/ToastContext';
import { ToastItem } from './Toast';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    // Only render if there are toasts (optimization? actually portal is cheap)

    return createPortal(
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none', // Allow clicking through the container area
            // Newest at bottom
        }}>
            {toasts.map((toast, index) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={onRemove}
                    index={index}
                />
            ))}
        </div>,
        document.body
    );
}
