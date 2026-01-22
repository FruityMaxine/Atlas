/**
 * Toggle 开关组件
 * 
 * 用途：布尔值设置（开/关）
 * 特性：流畅动画、悬停效果、光晕反馈
 */

import './Toggle.css';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
    // 移除 isHovering 状态，改用 CSS 的 :hover 伪类实现

    return (
        <div className={`atlas-toggle-container ${label ? 'has-label' : 'no-label'} ${disabled ? 'disabled' : ''}`}>
            {label && (
                <div className="atlas-toggle-text-wrapper">
                    <div className="atlas-toggle-label">
                        {label}
                    </div>
                    {description && (
                        <div className="atlas-toggle-desc">
                            {description}
                        </div>
                    )}
                </div>
            )}
            <div
                className={`atlas-toggle-track cursor-target ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && onChange(!checked)}
            >
                <div className={`atlas-toggle-thumb ${checked ? 'checked' : ''}`} />
            </div>
        </div>
    );
}
