/**
 * SettingCard 设置卡片组件
 * 
 * 用途：将相关设置项分组显示
 * 特性：带阴影的卡片、可自定义标题和图标
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import './SettingCard.css';

interface SettingCardProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
}

export default function SettingCard({ title, icon, children }: SettingCardProps) {
    return (
        <div className="atlas-setting-card">
            {/* 卡片标题 */}
            <div className="atlas-setting-card-header">
                <div className="atlas-setting-card-title">
                    {icon && (() => {
                        const IconComponent = icon;
                        return <IconComponent size={20} />;
                    })()}
                    {title}
                </div>
            </div>
            {/* 卡片内容 */}
            <div>
                {children}
            </div>
        </div>
    );
}
