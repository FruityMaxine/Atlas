import React from 'react';
import { parseSchema } from './SchemaRenderer/Parser';
import { SchemaRenderer } from './SchemaRenderer';

export interface ModuleMetadata {
  id: string;
  name: string;
  mode: 'declarative' | 'custom';
  path: string;
}

export interface ModuleContextType {
  moduleId: string;
  moduleName: string;
  port: number;
  apiClient: {
    get: (endpoint: string) => Promise<any>;
    post: (endpoint: string, data: any) => Promise<any>;
  };
  invoke: (command: string, args?: any) => Promise<any>;
}

export const ModuleContext = React.createContext<ModuleContextType | null>(null);

const uiCache = new Map<string, Promise<React.ComponentType>>();

const buildErrorComponent = (moduleId: string, message: string): React.ComponentType => () =>
  React.createElement(
    'div',
    {
      style: {
        padding: '24px',
        textAlign: 'center' as const,
        color: 'var(--text-error, #ef4444)',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      },
    },
    [
      React.createElement('h3', { key: 'title' }, '模块加载失败'),
      React.createElement(
        'p',
        { key: 'id', style: { marginTop: '8px', opacity: 0.8 } },
        `模块 ID：${moduleId}`,
      ),
      React.createElement(
        'code',
        {
          key: 'error',
          style: {
            display: 'block',
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(255,0,0,0.1)',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'Consolas, Monaco, monospace',
            textAlign: 'left' as const,
            whiteSpace: 'pre-wrap' as const,
          },
        },
        message,
      ),
    ],
  );

async function resolveDeclarativeUI(moduleId: string): Promise<React.ComponentType | null> {
  const layoutUrl = `/modules/${moduleId}/ui/layout.json5`;
  const response = await fetch(layoutUrl);
  if (!response.ok) {
    return null;
  }

  const text = await response.text();
  const document = parseSchema(text);
  if (document.schema.length === 0) {
    return null;
  }

  console.log(`[模块加载器] 已加载声明式模块：${moduleId}`);
  return () => React.createElement(SchemaRenderer, { schema: document.schema, meta: document.meta });
}

async function resolveCustomUI(moduleId: string): Promise<React.ComponentType> {
  const tsxModule = await import(/* @vite-ignore */ `../../modules/${moduleId}/ui/index.tsx`);
  const component = tsxModule.default || tsxModule[Object.keys(tsxModule)[0]];
  if (!component) {
    throw new Error('未找到可用的 React 组件导出');
  }

  console.log(`[模块加载器] 已加载 React 模块：${moduleId}`);
  return component as React.ComponentType;
}

export async function loadModuleUI(moduleId: string): Promise<React.ComponentType> {
  const cached = uiCache.get(moduleId);
  if (cached) {
    return cached;
  }

  const task = (async () => {
    try {
      const declarative = await resolveDeclarativeUI(moduleId);
      if (declarative) {
        return declarative;
      }
      return await resolveCustomUI(moduleId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[模块加载器] 加载失败：${moduleId}`, error);
      return buildErrorComponent(moduleId, message);
    }
  })();

  uiCache.set(moduleId, task);
  return task;
}

export async function preloadModuleUI(moduleId: string): Promise<void> {
  await loadModuleUI(moduleId);
}

export function clearModuleUICache(moduleId?: string): void {
  if (moduleId) {
    uiCache.delete(moduleId);
    return;
  }
  uiCache.clear();
}

export function createModuleContext(
  moduleId: string,
  moduleName: string,
  port: number = 8080,
): ModuleContextType {
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    moduleId,
    moduleName,
    port,
    apiClient: {
      get: async (endpoint: string) => {
        const response = await fetch(`${baseUrl}${endpoint}`);
        if (!response.ok) {
          throw new Error(`GET ${endpoint} 失败：${response.status} ${response.statusText}`);
        }
        return response.json();
      },
      post: async (endpoint: string, data: any) => {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`POST ${endpoint} 失败：${response.status} ${response.statusText} - ${text}`);
        }
        return response.json();
      },
    },
    invoke: async (command: string, args?: any) => {
      if ((window as any).__TAURI__) {
        return (window as any).__TAURI__.invoke(command, args);
      }
      throw new Error('当前运行环境不支持 Tauri API');
    },
  };
}
