/**
 * SettingCard 设置卡片组件
 * 
 * 用途：将相关设置项分组显示
 * 特性：带阴影的卡片、可自定义标题和图标
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
}

export default function SettingCard({ title, icon, children }: SettingCardProps) {
    return (
        <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-primary)',
            overflow: 'hidden',
            marginBottom: '10px',
            boxShadow: 'var(--shadow-md)',
            breakInside: 'avoid',        // 防止卡片被截断到两列
            display: 'inline-block',     // 必须设置，配合 break-inside
            width: '100%',               // 占满列宽
        }}>
            {/* 卡片标题 */}
            <div style={{
                padding: '16px 20px',
                background: 'var(--bg-card-hover)',
                borderBottom: '1px solid var(--border-primary)',
            }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
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
