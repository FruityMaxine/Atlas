/**
 * Icon 图标包装组件
 * 
 * 用途：统一管理 Lucide React 图标的样式和使用
 * 特性：支持自定义大小、颜色和类名
 */

import { LucideIcon } from 'lucide-react';

interface IconProps {
    icon: LucideIcon;
    size?: number;
    color?: string;
    className?: string;
}

export default function Icon({
    icon: IconComponent,
    size = 20,
    color,
    className
}: IconProps) {
    return (
        <IconComponent
            size={size}
            color={color}
            className={className}
            style={{ flexShrink: 0 }}
        />
    );
}
