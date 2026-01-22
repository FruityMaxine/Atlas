import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { Toast, ToastType } from '../../../contexts/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import './Toast.css';

// ===== Toast 列表项组件 =====

interface ToastProps {
    /** Toast 数据对象 */
    toast: Toast;
    /** 移除回调 */
    onRemove: (id: string) => void;
    /** 索引，用于计算堆叠动画延迟 */
    index: number;
}

export function ToastItem({ toast, onRemove }: ToastProps) {


    // 倒计时逻辑
    const duration = toast.duration || 3000;
    const remainingTime = useRef(duration);
    const startTime = useRef(Date.now());
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startTimer = () => {
        if (remainingTime.current <= 0) {
            onRemove(toast.id);
            return;
        }

        startTime.current = Date.now();
        timerRef.current = setTimeout(() => {
            onRemove(toast.id);
        }, remainingTime.current);
    };

    const pauseTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        // 计算剩余时间
        const elapsed = Date.now() - startTime.current;
        remainingTime.current -= elapsed;
    };

    useEffect(() => {
        // 挂载时开始计时
        startTimer();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseEnter = () => {
        pauseTimer();
    };

    const handleMouseLeave = () => {
        startTimer();
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止触发 Toast 点击事件
        onRemove(toast.id);
    };

    const icons: Record<ToastType, JSX.Element> = {
        success: <CheckCircle size={20} color="var(--toast-success)" />,
        error: <AlertCircle size={20} color="var(--toast-error)" />,
        warning: <AlertTriangle size={20} color="var(--toast-warning)" />,
        info: <Info size={20} color="var(--toast-info)" />,
    };

    return (
        <motion.div
            className={`atlas-toast-item ${toast.onClick ? 'clickable cursor-target' : ''}`}
            layout // 启用布局动画，实现平滑堆叠
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 1 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
                if (toast.onClick) {
                    toast.onClick();
                }
            }}
        >
            {/* 图标区域 */}
            <div className="atlas-toast-icon">
                {icons[toast.type]}
            </div>

            {/* 内容区域 */}
            <div className="atlas-toast-content">
                <h4 className="atlas-toast-title">
                    {toast.type === 'error' ? '错误' :
                        toast.type === 'success' ? '成功' :
                            toast.type === 'warning' ? '警告' : '提示'}
                </h4>
                <p className="atlas-toast-message">
                    {toast.message}
                </p>
            </div>

            {/* 关闭按钮 */}
            <button
                onClick={handleClose}
                className="atlas-toast-close-btn"
            >
                <X size={16} />
            </button>

            {/* 倒计时进度条 (当暂停时显示为高亮或冻结，这里做一个简单的小横条提示) */}

        </motion.div>
    );
}

// ===== Toast 容器组件 =====

interface ToastContainerProps {
    /** 当前显示的 Toast 列表 */
    toasts: Toast[];
    /** 移除回调 */
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    // 使用 Portal 将提示框渲染到 body 底部，确保不被其他元素遮挡
    return createPortal(
        <div className="atlas-toast-container">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast, index) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onRemove={onRemove}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}

export default ToastContainer;
