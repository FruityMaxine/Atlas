/**
 * 爬虫模块页面
 * 
 * 功能：
 * - 模拟爬虫任务列表
 * - 展示进度条组件
 * - 卡片列表布局
 */

import { Bug, ClipboardList, Zap, CheckCircle, XCircle } from 'lucide-react';

function CrawlerPage() {
    // 模拟爬虫任务数据
    const tasks = [
        { id: 1, name: '网站A数据采集', progress: 75, status: '运行中', color: '#3B82F6' },
        { id: 2, name: '网站B内容抓取', progress: 45, status: '运行中', color: '#8B5CF6' },
        { id: 3, name: '网站C图片下载', progress: 100, status: '已完成', color: '#10B981' },
        { id: 4, name: '网站D数据分析', progress: 20, status: '运行中', color: '#F59E0B' },
    ];

    return (
        <div style={{
            padding: '60px',
            maxWidth: '1200px',
        }}>
            {/* 标题 */}
            <div className="fade-in-up" style={{
                marginBottom: '40px',
            }}>
                <h1 style={{
                    fontSize: '42px',
                    marginBottom: '12px',
                    background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Bug size={42} />
                        爬虫模块
                    </div>
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#9CA3AF',
                }}>
                    高效的数据采集工具
                </p>
            </div>

            {/* 统计卡片 */}
            <div className="scale-in" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '40px',
                animationDelay: '0.2s',
                animationFillMode: 'backwards',
            }}>
                {[
                    { label: '总任务', value: '24', icon: ClipboardList },
                    { label: '运行中', value: '3', icon: Zap },
                    { label: '已完成', value: '18', icon: CheckCircle },
                    { label: '失败', value: '3', icon: XCircle },
                ].map((stat, index) => (
                    <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                            {(() => {
                                const IconComponent = stat.icon;
                                return <IconComponent size={32} />;
                            })()}
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* 任务列表 */}
            <h2 style={{
                fontSize: '24px',
                marginBottom: '20px',
                color: '#fff',
            }}>
                当前任务
            </h2>

            <div>
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="fade-in-up"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animationDelay: `${0.4 + index * 0.1}s`,
                            animationFillMode: 'backwards',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(8px)';
                            e.currentTarget.style.borderColor = task.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                        }}>
                            <h3 style={{ fontSize: '18px', color: '#fff' }}>
                                {task.name}
                            </h3>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                background: task.status === '已完成' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                color: task.status === '已完成' ? '#10B981' : '#3B82F6',
                            }}>
                                {task.status}
                            </span>
                        </div>

                        {/* 进度条 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <div style={{
                                flex: 1,
                                height: '8px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: `${task.progress}%`,
                                    height: '100%',
                                    background: task.color,
                                    transition: 'width 0.5s ease',
                                }} />
                            </div>
                            <span style={{ fontSize: '14px', color: '#9CA3AF', minWidth: '45px' }}>
                                {task.progress}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 新建任务按钮 */}
            <button style={{
                marginTop: '24px',
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                ➕ 新建爬虫任务
            </button>
        </div>
    );
}

export default CrawlerPage;
