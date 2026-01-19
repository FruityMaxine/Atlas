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
import DecryptedText from '../components/ui/DecryptedText';

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
        <div style={{
            padding: '60px',
            maxWidth: '1200px',
            margin: '0 auto',
        }}>
            {/* Hero 区域 */}
            <div style={{
                textAlign: 'center',
                marginBottom: '80px',
            }}>
                <h1 style={{
                    fontSize: '56px',
                    marginBottom: '24px',
                    background: 'linear-gradient(130deg, #5a98fcff, #4900f3ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
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

                <h2 style={{
                    fontSize: '20px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.8',
                    maxWidth: '600px',
                    margin: '0 auto',
                }}>
                    模块启动器
                </h2>

                {/* 开始按钮 */}
                <button
                    className="cursor-target"
                    style={{
                        marginTop: '40px',
                        padding: '16px 48px',
                        fontSize: '18px',
                        fontWeight: '600',
                        background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseDown={(e) => {
                        // 按下：向下位移，并产生挤压缩放效果 (x轴拉宽，y轴压扁)
                        e.currentTarget.style.transform = 'translateY(2px) scale(0.96, 0.9)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(59, 130, 246, 0.2)';
                    }}
                    onMouseUp={(e) => {
                        // 抬起：弹回悬浮高度，并稍微放大产生弹性感
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.6)';
                    }}
                    onClick={() => {
                        window.location.href = 'https://e-hentai.org/tag/female:femdom';
                    }}
                >
                    开始探索 →
                </button>
            </div>

            {/* 功能卡片 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '30px',
            }}>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="scale-in"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '40px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animationDelay: `${index * 0.15}s`,
                            animationFillMode: 'backwards',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.borderColor = feature.color;
                            e.currentTarget.style.boxShadow = `0 10px 40px ${feature.color}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            {(() => {
                                const IconComponent = feature.icon;
                                return <IconComponent size={64} />;
                            })()}
                        </div>
                        <h3 style={{
                            fontSize: '24px',
                            marginBottom: '12px',
                            color: feature.color,
                        }}>
                            {feature.title}
                        </h3>
                        <p style={{
                            fontSize: '16px',
                            color: '#9CA3AF',
                            lineHeight: '1.6',
                        }}>
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* 统计数据 */}
            <div className="fade-in" style={{
                marginTop: '80px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '40px',
                textAlign: 'center',
                animationDelay: '0.5s',
                animationFillMode: 'backwards',
            }}>
                <div>
                    <div style={{ fontSize: '48px', fontWeight: '700', color: '#3B82F6' }}>
                        1,234
                    </div>
                    <div style={{ fontSize: '16px', color: '#9CA3AF', marginTop: '8px' }}>
                        任务完成
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '48px', fontWeight: '700', color: '#8B5CF6' }}>
                        567
                    </div>
                    <div style={{ fontSize: '16px', color: '#9CA3AF', marginTop: '8px' }}>
                        活跃用户
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '48px', fontWeight: '700', color: '#10B981' }}>
                        98%
                    </div>
                    <div style={{ fontSize: '16px', color: '#9CA3AF', marginTop: '8px' }}>
                        满意度
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
