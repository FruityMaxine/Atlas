import React, { useEffect, useMemo, useRef } from 'react';
import './LogViewer.css';

interface LogViewerProps {
  label?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  autoScroll?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const LogViewer: React.FC<LogViewerProps> = ({
  label,
  value = '',
  placeholder = '暂无日志输出',
  rows = 10,
  autoScroll = true,
  style,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={`atlas-log-viewer ${className}`.trim()} style={style}>
      {label ? <div className="atlas-log-label">{label}</div> : null}
      <div
        ref={panelRef}
        className="atlas-log-panel"
        style={{ minHeight: `${Math.max(4, rows) * 20}px` }}
      >
        <pre>{text}</pre>
      </div>
    </div>
  );
};

export default LogViewer;
