import { useEffect, useMemo, useState } from 'react';
import { Wrench } from 'lucide-react';
import { Sidebar, WindowBar } from './components/layout';
import TargetCursor from './components/ui/TargetCursor/TargetCursor';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';

import HomePage from './pages/HomePage/HomePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import CrawlerPage from './pages/CrawlerPage/CrawlerPage';
import ComponentShowcasePage from './pages/ComponentShowcasePage/ComponentShowcasePage';
import ModuleTestPage from './pages/ModuleTestPage/ModuleTestPage';
import ModulePage from './pages/ModulePage/ModulePage';
import { preloadModuleUI } from './core/ModuleLoader';
import { ModuleInfo, useModuleRegistry } from './core/ModuleRegistry';

import { SchemaRenderer } from './core/SchemaRenderer';
import { parseSchema } from './core/SchemaRenderer/Parser';
import { demoLayout } from './core/SchemaRenderer/DemoConfig';

let hasInitialModuleScan = false;
let hasStartupWarmup = false;

type TauriInvoke = <T = unknown>(command: string, args?: Record<string, unknown>) => Promise<T>;

const hasTauriRuntime = (): boolean =>
  typeof window !== 'undefined' && Boolean((window as any).__TAURI__ || (window as any).__TAURI_INTERNALS__);

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

async function warmupModules(
  modules: ModuleInfo[],
  setModuleStatus: (id: string, status: ModuleInfo['status']) => void,
): Promise<void> {
  await Promise.allSettled(modules.map((module) => preloadModuleUI(module.id)));

  const invoke = await resolveTauriInvoke();
  if (!invoke) {
    return;
  }

  await Promise.allSettled(
    modules.map(async (module) => {
      if (!module.backend?.enabled) {
        return;
      }

      setModuleStatus(module.id, 'starting');
      try {
        const [, port] = await invoke<[number, number]>('launch_module', {
          manifest: module,
          waitHealth: false,
        });
        setModuleStatus(module.id, 'running');
        console.log(`[模块预热] ${module.name} 已启动，端口：${port}`);
      } catch (error) {
        setModuleStatus(module.id, 'error');
        console.warn(`[模块预热] ${module.name} 启动失败`, error);
      }
    }),
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showWindowBar, setShowWindowBar] = useState(false);
  const { mouseAnimation, enableComponentPage } = useSettings();
  const { modules, scanModules, setModuleStatus } = useModuleRegistry();

  useEffect(() => {
    setShowWindowBar(hasTauriRuntime());
  }, []);

  useEffect(() => {
    if (!enableComponentPage && currentPage === 'components') {
      setCurrentPage('home');
    }
  }, [currentPage, enableComponentPage]);

  useEffect(() => {
    if (hasInitialModuleScan) {
      return;
    }
    hasInitialModuleScan = true;
    void scanModules();
  }, [scanModules]);

  useEffect(() => {
    if (hasStartupWarmup || modules.length === 0) {
      return;
    }

    hasStartupWarmup = true;
    void warmupModules(modules, setModuleStatus);
  }, [modules, setModuleStatus]);

  const contentHeight = useMemo(() => (showWindowBar ? 'calc(100vh - 42px)' : '100vh'), [showWindowBar]);
  const isModuleDetailPage = currentPage.startsWith('module-');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'settings':
        return <SettingsPage />;
      case 'crawler':
        return <CrawlerPage />;
      case 'components':
        return <ComponentShowcasePage />;
      case 'moduleTest':
        return <ModuleTestPage />;
      case 'downloader':
        return <SchemaDemoPage />;
      case 'tools':
        return <ToolsPlaceholder />;
      default:
        if (currentPage.startsWith('module-')) {
          const moduleId = currentPage.replace('module-', '');
          return <ModulePage moduleId={moduleId} key={moduleId} />;
        }
        return <HomePage />;
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'var(--bg-tertiary)' }}>
      {showWindowBar ? <WindowBar /> : null}

      <div
        style={{
          display: 'flex',
          height: contentHeight,
          background: 'var(--bg-tertiary)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <TargetCursor
          key={`cursor-${mouseAnimation}`}
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
        />

        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        <div
          style={{
            flex: 1,
            overflowY: isModuleDetailPage ? 'hidden' : 'auto',
            background: 'var(--bg-tertiary)',
          }}
        >
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </SettingsProvider>
  );
}

function SchemaDemoPage() {
  const schemaDoc = parseSchema(demoLayout);

  return (
    <div
      className="fade-in-up"
      style={{
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            marginBottom: '8px',
            background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          声明式 UI 引擎演示
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          基于 JSON 配置驱动，使用 React 渲染。
        </p>
      </div>

      <SchemaRenderer schema={schemaDoc.schema} meta={schemaDoc.meta} />
    </div>
  );
}

function ToolsPlaceholder() {
  return (
    <div
      className="fade-in-up"
      style={{
        padding: '60px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '80px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
        <Wrench size={80} />
      </div>
      <h1
        style={{
          fontSize: '42px',
          marginBottom: '16px',
          background: 'linear-gradient(90deg, #10B981, #059669)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        工具箱模块
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>敬请期待...</p>
    </div>
  );
}

export default App;

