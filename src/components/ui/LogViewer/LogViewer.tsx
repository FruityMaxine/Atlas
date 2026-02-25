import React, { useEffect, useMemo, useRef } from 'react';
import './LogViewer.css';

interface LogViewerProps {
  label?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  autoScroll?: boolean;
  onInputSubmit?: (input: string) => void;
  inputPlaceholder?: string;
  style?: React.CSSProperties;
  className?: string;
}

const LogViewer: React.FC<LogViewerProps> = ({
  label,
  value = '',
  placeholder = '暂无日志输出',
  rows = 10,
  autoScroll = true,
  onInputSubmit,
  inputPlaceholder = 'Type a command and press Enter...',
  style,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const text = useMemo(() => {
    const trimmed = value?.toString() ?? '';
    return trimmed.length > 0 ? trimmed : placeholder;
  }, [value, placeholder]);

  useEffect(() => {
    if (!autoScroll || !panelRef.current) {
      return;
    }
    panelRef.current.scrollTop = panelRef.current.scrollHeight;
  }, [text, autoScroll]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onInputSubmit?.(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={`atlas-log-viewer ${className}`.trim()} style={style}>
      <div
        ref={panelRef}
        className="atlas-log-panel"
        style={{ height: `${Math.max(4, rows) * 21 + (label ? 40 : 0)}px` }}
      >
        {label && (
          <div className="atlas-log-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="atlas-log-icon">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            <span className="atlas-log-title">{label}</span>
            {onInputSubmit && <span className="atlas-log-badge">Interactive</span>}
          </div>
        )}

        <div className="atlas-log-content">
          <pre>{text}</pre>
        </div>

        {onInputSubmit && (
          <div className="atlas-log-input-row">
            <span className="atlas-log-prompt">❯</span>
            <input
              type="text"
              className="atlas-log-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
