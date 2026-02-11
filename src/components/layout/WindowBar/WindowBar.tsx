import React, { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { appWindow } from '@tauri-apps/api/window';
import './WindowBar.css';

const isTauriRuntime = (): boolean =>
  typeof window !== 'undefined' && Boolean((window as any).__TAURI__ || (window as any).__TAURI_INTERNALS__);

const WindowBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isTauriRuntime());
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <header className="atlas-window-bar" data-tauri-drag-region>
      <div className="atlas-window-brand" data-tauri-drag-region>
        <span className="atlas-window-dot" />
        <span className="atlas-window-title">Atlas Workbench</span>
      </div>

      <div className="atlas-window-actions">
        <button
          type="button"
          className="atlas-window-btn"
          onClick={() => {
            void appWindow.minimize();
          }}
          aria-label="最小化"
          title="最小化"
        >
          <Minus size={16} />
        </button>

        <button
          type="button"
          className="atlas-window-btn"
          onClick={() => {
            void appWindow.toggleMaximize();
          }}
          aria-label="最大化或还原"
          title="最大化或还原"
        >
          <Square size={14} />
        </button>

        <button
          type="button"
          className="atlas-window-btn atlas-window-close"
          onClick={() => {
            void appWindow.close();
          }}
          aria-label="关闭"
          title="关闭"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
};

export default WindowBar;
