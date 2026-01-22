/**
 * 主页组件
 * 
 * 功能：
 * - 展示欢迎信息
 * - 显示项目介绍
 * - 功能卡片展示
 * - 使用了多种动画效果
 */

import { Rocket, Zap, Palette, LucideIcon } from 'lucide-react';
import { DecryptedText } from '../../components/ui';
import './HomePage.css';

function HomePage() {
    // 功能卡片数据
    const features: { icon: LucideIcon; title: string; desc: string; color: string; }[] = [
        {
            icon: Rocket,
            title: '快速启动',
            desc: '一键启动您的工作流程',
            color: '#3B82F6'
        },
        {
            icon: Zap,
            title: '高效处理',
            desc: '多线程并发处理任务',
            color: '#8B5CF6'
        },
        {
            icon: Palette,
            title: '精美界面',
            desc: '现代化的用户体验',
            color: '#10B981'
        },
    ];

    return (
        <div className="homepage-container">
            {/* Hero 区域 */}
            <div className="homepage-hero">
                <h1 className="homepage-title">
                    <DecryptedText
                        text="Atlas"
                        animateOn="view"
                        revealDirection="start"
                        sequential={true}       // 改为逐字解密（更容易看清）
                        speed={15}              // 每个字符间隔 80 毫秒（够慢了）
                        maxIterations={15}      // 每个字符闪烁 15 次再显示
                        startDelay={100}       // 延迟 1 秒后开始解密
                    />
                </h1>

                <h2 className="homepage-subtitle">
                    模块启动器
                </h2>

                {/* 开始按钮 */}
                {/* 
                    注：原有的 JS onmouseenter/leave/down/up 逻辑已完全转换为 
                    HomePage.css 中的 :hover 和 :active 伪类，
                    不仅性能更好，而且代码更简洁。
                */}
                <button
                    className="homepage-start-btn cursor-target"
                    onClick={() => {
                        window.location.href = 'https://e-hentai.org/tag/female:femdom';
                    }}
                >
                    开始探索 →
                </button>
            </div>

            {/* 功能卡片 */}
            <div className="homepage-features-grid">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="homepage-feature-card scale-in"
                        style={{
                            animationDelay: `${index * 0.15}s`,
                        }}
                        onMouseEnter={(e) => {
                            // 保持动态颜色的 Hover 逻辑
                            e.currentTarget.style.borderColor = feature.color;
                            e.currentTarget.style.boxShadow = `0 10px 40px ${feature.color}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div className="homepage-feature-icon">
                            {(() => {
                                const IconComponent = feature.icon;
                                return <IconComponent size={64} />;
                            })()}
                        </div>
                        <h3 className="homepage-feature-title" style={{ color: feature.color }}>
                            {feature.title}
                        </h3>
                        <p className="homepage-feature-desc">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* 统计数据 */}
            <div className="homepage-stats-grid fade-in">
                <div className="homepage-stat-container">
                    <div className="homepage-stat-value text-blue">
                        1,234
                    </div>
                    <div className="homepage-stat-label">
                        任务完成
                    </div>
                </div>
                <div className="homepage-stat-container">
                    <div className="homepage-stat-value text-purple">
                        567
                    </div>
                    <div className="homepage-stat-label">
                        活跃用户
                    </div>
                </div>
                <div className="homepage-stat-container">
                    <div className="homepage-stat-value text-green">
                        98%
                    </div>
                    <div className="homepage-stat-label">
                        满意度
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
