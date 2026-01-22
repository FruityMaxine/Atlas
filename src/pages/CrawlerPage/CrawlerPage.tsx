/**
 * 爬虫模块页面
 * 
 * 功能：
 * - 模拟爬虫任务列表
 * - 展示进度条组件
 * - 卡片列表布局
 */

import { Bug, ClipboardList, Zap, CheckCircle, XCircle } from 'lucide-react';
import './CrawlerPage.css';

function CrawlerPage() {
    // 模拟爬虫任务数据
    const tasks = [
        { id: 1, name: '网站A数据采集', progress: 75, status: '运行中', color: '#3B82F6' },
        { id: 2, name: '网站B内容抓取', progress: 45, status: '运行中', color: '#8B5CF6' },
        { id: 3, name: '网站C图片下载', progress: 100, status: '已完成', color: '#10B981' },
        { id: 4, name: '网站D数据分析', progress: 20, status: '运行中', color: '#F59E0B' },
    ];

    return (
        <div className="crawler-container">
            {/* 标题 */}
            <div className="crawler-header fade-in-up">
                <h1 className="crawler-title">
                    <div className="crawler-title-content">
                        <Bug size={42} />
                        爬虫模块
                    </div>
                </h1>
                <p className="crawler-description">
                    高效的数据采集工具
                </p>
            </div>

            {/* 统计卡片 */}
            <div className="crawler-stats-grid scale-in">
                {[
                    { label: '总任务', value: '24', icon: ClipboardList },
                    { label: '运行中', value: '3', icon: Zap },
                    { label: '已完成', value: '18', icon: CheckCircle },
                    { label: '失败', value: '3', icon: XCircle },
                ].map((stat, index) => (
                    <div key={index} className="crawler-stat-card">
                        <div className="crawler-stat-icon">
                            {(() => {
                                const IconComponent = stat.icon;
                                return <IconComponent size={32} />;
                            })()}
                        </div>
                        <div className="crawler-stat-value">
                            {stat.value}
                        </div>
                        <div className="crawler-stat-label">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* 任务列表 */}
            <h2 className="crawler-tasks-title">
                当前任务
            </h2>

            <div>
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="crawler-task-card fade-in-up"
                        style={{
                            animationDelay: `${0.4 + index * 0.1}s`,
                        }}
                        onMouseEnter={(e) => {
                            // 仅保留动态颜色处理
                            e.currentTarget.style.borderColor = task.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <div className="crawler-task-header">
                            <h3 className="crawler-task-name">
                                {task.name}
                            </h3>
                            <span
                                className="crawler-task-status"
                                style={{
                                    background: task.status === '已完成' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    color: task.status === '已完成' ? '#10B981' : '#3B82F6',
                                }}
                            >
                                {task.status}
                            </span>
                        </div>

                        {/* 进度条 */}
                        <div className="crawler-progress-wrapper">
                            <div className="crawler-progress-bg">
                                <div
                                    className="crawler-progress-fill"
                                    style={{
                                        width: `${task.progress}%`,
                                        background: task.color,
                                    }}
                                />
                            </div>
                            <span className="crawler-progress-text">
                                {task.progress}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 新建任务按钮 */}
            {/* JS Hover logic removed, replaced by CSS :hover */}
            <button className="crawler-new-task-btn">
                ➕ 新建爬虫任务
            </button>
        </div>
    );
}

export default CrawlerPage;
