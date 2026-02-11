import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/**
 * 根据图标名称动态获取 Lucide 图标组件
 * @param name 图标名称 (e.g. "Home", "Settings", "Download")
 * @returns LucideIcon 组件或 undefined
 */
export const getIcon = (name?: string): LucideIcon | undefined => {
    if (!name) return undefined;
    // 尝试直接匹配
    if ((Icons as any)[name]) {
        return (Icons as any)[name] as LucideIcon;
    }
    // 尝试首字母大写
    const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
    return (Icons as any)[pascalName] as LucideIcon | undefined;
};
