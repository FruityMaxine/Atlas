import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Play, Square, Terminal, TriangleAlert } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../contexts/ToastContext';
import {
  createModuleContext,
  loadModuleUI,
  ModuleContext,
  ModuleContextType,
} from '../../core/ModuleLoader';
import { ModuleInfo, useModuleRegistry } from '../../core/ModuleRegistry';
import { useSchemaStore } from '../../core/SchemaRenderer/SchemaStore';
import './ModulePage.css';

interface ModulePageProps {
  moduleId: string;
}

type TauriInvoke = <T = unknown>(command: string, args?: Record<string, unknown>) => Promise<T>;

const DEFAULT_PORT = 8080;

const resolveTauriInvoke = async (): Promise<TauriInvoke | null> => {
  const runtimeInvoke =
    (window as any).__TAURI__?.invoke ??
    (window as any).__TAURI__?.tauri?.invoke ??
    (window as any).__TAURI_INTERNALS__?.invoke;
  if (typeof runtimeInvoke === 'function') {
    return runtimeInvoke as TauriInvoke;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/tauri');
    return invoke as TauriInvoke;
  } catch {
    return null;
  }
};

const ModulePage: React.FC<ModulePageProps> = ({ moduleId }) => {
  const { modules, setModuleStatus } = useModuleRegistry();
  const { showToast } = useToast();
  const { reset } = useSchemaStore();

  const [moduleUI, setModuleUI] = useState<React.ComponentType | null>(null);
  const [backendPort, setBackendPort] = useState<number | null>(null);
  const [uiLoading, setUiLoading] = useState(true);
  const [backendLoading, setBackendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoStartedModuleIdRef = useRef<string | null>(null);

  const moduleInfo = useMemo(
    () => modules.find((module) => module.id === moduleId) || null,
    [moduleId, modules],
  );

  const startBackend = useCallback(
    async (manifest: ModuleInfo, reason: 'auto' | 'manual' = 'auto'): Promise<void> => {
      if (!manifest.backend?.enabled) {
        const fallbackPort = manifest.backend?.port ?? DEFAULT_PORT;
        setBackendPort(fallbackPort);
        setModuleStatus(manifest.id, 'stopped');
        return;
      }

      const invoke = await resolveTauriInvoke();
      if (!invoke) {
        const fallbackPort = manifest.backend.port ?? DEFAULT_PORT;
        setBackendPort(fallbackPort);
        setModuleStatus(manifest.id, 'running');
        if (reason === 'manual') {
          showToast('当前为浏览器模式，已使用默认端口模拟后端连接。', 'warning');
        }
        return;
      }

      setBackendLoading(true);
      setModuleStatus(manifest.id, 'starting');

      try {
        const [, port] = await invoke<[number, number]>('launch_module', {
          manifest,
          waitHealth: false,
        });

        setBackendPort(Number(port));
        setModuleStatus(manifest.id, 'running');
        if (reason === 'manual') {
          showToast(`后端已启动，端口：${port}`, 'success');
        }
      } catch (launchError) {
        const message = launchError instanceof Error ? launchError.message : String(launchError);
        setModuleStatus(manifest.id, 'error');
        setError(`后端启动失败：${message}`);
        showToast(`模块 ${manifest.name} 启动失败：${message}`, 'error');
      } finally {
        setBackendLoading(false);
      }
    },
    [setModuleStatus, showToast],
  );

  const stopBackend = useCallback(async (): Promise<void> => {
    if (!moduleInfo) {
      return;
    }

    const invoke = await resolveTauriInvoke();
    if (!invoke) {
      setBackendPort(null);
      setModuleStatus(moduleInfo.id, 'stopped');
      showToast('当前为浏览器模式，无真实后端可停止。', 'warning');
      return;
    }

    try {
      await invoke<string>('stop_module', { id: moduleInfo.id });
      setBackendPort(null);
      setModuleStatus(moduleInfo.id, 'stopped');
      showToast(`模块 ${moduleInfo.name} 已停止。`, 'success');
    } catch (stopError) {
      const message = stopError instanceof Error ? stopError.message : String(stopError);
      showToast(`停止模块失败：${message}`, 'error');
    }
  }, [moduleInfo, setModuleStatus, showToast]);

  useEffect(() => {
    let active = true;

    setUiLoading(true);
    setError(null);
    setModuleUI(null);
    setBackendPort(null);
    reset();

    loadModuleUI(moduleId)
      .then((loadedUI) => {
        if (!active) {
          return;
        }
        setModuleUI(() => loadedUI);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        const message = loadError instanceof Error ? loadError.message : String(loadError);
        setError(`界面加载失败：${message}`);
      })
      .finally(() => {
        if (active) {
          setUiLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [moduleId, reset]);

  useEffect(() => {
    if (!moduleInfo || !moduleInfo.backend?.enabled) {
      return;
    }

    if (autoStartedModuleIdRef.current === moduleId) {
      return;
    }

    autoStartedModuleIdRef.current = moduleId;
    void startBackend(moduleInfo, 'auto');
  }, [moduleId, moduleInfo, startBackend]);

  const moduleContext: ModuleContextType | null = useMemo(() => {
    if (!moduleInfo) {
      return null;
    }

    const port = backendPort ?? moduleInfo.backend?.port ?? DEFAULT_PORT;
    return createModuleContext(moduleInfo.id, moduleInfo.name, port);
  }, [backendPort, moduleInfo]);

  const isDeclarativeModule = moduleInfo?.ui?.mode === 'declarative';

  if (!moduleInfo && modules.length === 0) {
    return (
      <div className="module-page module-page-empty">
        <Loader2 className="spin" size={22} />
        <div>
          <h2>正在加载模块信息</h2>
          <p>请稍候...</p>
        </div>
      </div>
    );
  }

  if (!moduleInfo) {
    return (
      <div className="module-page module-page-empty">
        <TriangleAlert size={22} />
        <div>
          <h2>未找到模块</h2>
          <p>模块 ID：{moduleId}</p>
        </div>
      </div>
    );
  }

  const statusLabelMap: Record<ModuleInfo['status'], string> = {
    stopped: '已停止',
    starting: '启动中',
    running: '运行中',
    error: '异常',
  };

  return (
    <div className="module-page fade-in-up">
      <header className="module-page-header">
        <div className="module-page-title-group">
          <h1>{moduleInfo.name}</h1>
          <p>{moduleInfo.description || '该模块暂无描述。'}</p>
        </div>

        <div className="module-page-ops">
          <span className={`module-status-tag status-${moduleInfo.status}`}>
            {statusLabelMap[moduleInfo.status]}
          </span>
          {backendPort && <span className="module-port">端口 {backendPort}</span>}
          <Button
            label={backendLoading ? '启动中...' : '重启后端'}
            icon={Play}
            variant="primary"
            size="small"
            disabled={backendLoading}
            onClick={() => {
              autoStartedModuleIdRef.current = null;
              void startBackend(moduleInfo, 'manual');
            }}
          />
          <Button
            label="停止后端"
            icon={Square}
            variant="danger"
            size="small"
            disabled={backendLoading || moduleInfo.status === 'stopped'}
            onClick={() => {
              void stopBackend();
            }}
          />
        </div>
      </header>

      <div className={`module-page-scroll ${isDeclarativeModule ? 'module-page-scroll-declarative' : ''}`}>
        <div className="module-page-scroll-inner">
          {error && (
            <div className="module-banner module-banner-error">
              <TriangleAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          {backendLoading && (
            <div className="module-banner module-banner-loading">
              <Loader2 className="spin" size={18} />
              <span>后端正在后台启动，界面可继续操作。</span>
            </div>
          )}

          <section
            className={`module-content-panel ${isDeclarativeModule ? 'module-content-panel-declarative' : ''}`}
          >
            {uiLoading && (
              <div className="module-loading-state">
                <Loader2 className="spin" size={24} />
                <p>正在加载模块界面...</p>
              </div>
            )}

            {!uiLoading && moduleUI && moduleContext && (
              <ModuleContext.Provider value={moduleContext}>
                {React.createElement(moduleUI)}
              </ModuleContext.Provider>
            )}

            {!uiLoading && !moduleUI && (
              <div className="module-loading-state">
                <Terminal size={24} />
                <p>模块界面未提供可渲染内容。</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
