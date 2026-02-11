import React, { useEffect, useMemo, useState } from 'react';
import { Play, Plug } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import SettingCard from '../../components/ui/SettingCard/SettingCard';
import { useToast } from '../../contexts/ToastContext';
import {
  createModuleContext,
  loadModuleUI,
  ModuleContext,
  ModuleContextType,
} from '../../core/ModuleLoader';
import { useModuleRegistry } from '../../core/ModuleRegistry';
import { useSchemaStore } from '../../core/SchemaRenderer/SchemaStore';
import './ModuleTestPage.css';

type TauriInvoke = <T = unknown>(command: string, args?: Record<string, unknown>) => Promise<T>;

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

/**
 * 模块测试页面
 * 1) 当前仅保留可运行的 FapelloDownloader 用于调试
 * 2) 不再使用 spider-module 作为测试入口
 */
const ModuleTestPage: React.FC = () => {
  const { showToast } = useToast();
  const { reset } = useSchemaStore();
  const { modules, scanModules } = useModuleRegistry();

  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [moduleUI, setModuleUI] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendPort, setBackendPort] = useState<number | null>(null);

  const availableModules = useMemo(
    () => modules.filter((module) => module.id === 'FapelloDownloader'),
    [modules],
  );

  const currentModule = useMemo(
    () => availableModules.find((module) => module.id === currentModuleId) || null,
    [availableModules, currentModuleId],
  );

  useEffect(() => {
    void scanModules();
  }, [scanModules]);

  useEffect(() => {
    if (currentModuleId) {
      return;
    }

    const defaultModule = availableModules.find((module) => module.id === 'FapelloDownloader');
    if (defaultModule) {
      void handleLoadModule(defaultModule.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableModules, currentModuleId]);

  const handleLoadModule = async (moduleId: string) => {
    setLoading(true);
    setError(null);
    setModuleUI(null);
    setBackendPort(null);
    reset();

    try {
      const ui = await loadModuleUI(moduleId);
      setModuleUI(() => ui);
      setCurrentModuleId(moduleId);
      showToast(`模块 ${moduleId} 加载成功`, 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      showToast(`模块加载失败：${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchBackend = async () => {
    if (!currentModule) {
      return;
    }

    try {
      showToast('正在启动后端服务...', 'info');

      const invoke = await resolveTauriInvoke();
      if (invoke) {
        const [pid, port] = (await invoke('launch_module', {
          manifest: currentModule,
          waitHealth: false,
        })) as [number, number];
        setBackendPort(port);
        showToast(`后端已启动，PID=${pid}，端口=${port}`, 'success');
      } else {
        const port = currentModule.backend?.port ?? 8080;
        setBackendPort(port);
        showToast('当前为浏览器模式，已使用模拟端口。', 'warning');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(`启动失败：${message}`, 'error');
    }
  };

  const handleStopBackend = async () => {
    if (!currentModuleId) {
      return;
    }

    try {
      const invoke = await resolveTauriInvoke();
      if (invoke) {
        const result = (await invoke('stop_module', {
          id: currentModuleId,
        })) as string;
        showToast(result, 'success');
      } else {
        showToast('当前为浏览器模式，无真实后端进程可停止。', 'warning');
      }
      setBackendPort(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(`停止失败：${message}`, 'error');
    }
  };

  const moduleContext: ModuleContextType | null =
    currentModuleId && currentModule
      ? createModuleContext(
          currentModuleId,
          currentModule.name,
          backendPort ?? currentModule.backend?.port ?? 8080,
        )
      : null;

  return (
    <div className="module-test-page">
      <div className="page-header">
        <h1>模块测试页面</h1>
        <p className="subtitle">实验调试模式（优先 FapelloDownloader）</p>
      </div>

      <div className="test-container">
        <SettingCard title="选择模块" icon={Plug}>
          <div className="module-selector">
            {availableModules.map((module) => (
              <Button
                key={module.id}
                label={module.name}
                onClick={() => {
                  void handleLoadModule(module.id);
                }}
                variant={currentModuleId === module.id ? 'primary' : undefined}
                disabled={loading}
              />
            ))}
            {availableModules.length === 0 && (
              <div className="status-message error">未找到 FapelloDownloader 模块，请先确认 manifest 配置。</div>
            )}
          </div>
        </SettingCard>

        {currentModuleId && (
          <SettingCard title="后端控制" icon={Play}>
            <div className="backend-controls">
              <Button
                label="启动后端"
                onClick={() => {
                  void handleLaunchBackend();
                }}
                variant="primary"
                disabled={Boolean(backendPort)}
              />
              <Button
                label="停止后端"
                onClick={() => {
                  void handleStopBackend();
                }}
                variant="danger"
                disabled={!backendPort}
              />
              {backendPort && (
                <span className="port-indicator">
                  运行端口：<code>{backendPort}</code>
                </span>
              )}
            </div>
          </SettingCard>
        )}

        {loading && (
          <div className="status-message loading">
            <div className="spinner"></div>
            <p>正在加载模块界面...</p>
          </div>
        )}

        {error && <div className="status-message error">{error}</div>}

        {moduleUI && moduleContext && !error && (
          <div className="module-ui-container">
            <div className="module-header">
              <h2>模块调试：{moduleContext.moduleName}</h2>
              <span className="module-id">模块 ID：{moduleContext.moduleId}</span>
            </div>

            <ModuleContext.Provider value={moduleContext}>{React.createElement(moduleUI)}</ModuleContext.Provider>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleTestPage;
