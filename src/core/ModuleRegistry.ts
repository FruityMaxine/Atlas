import { create } from 'zustand';

export interface ModuleInfo {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  icon?: string;
  backend?: {
    enabled?: boolean;
    port?: number;
    args?: string[];
    health_check?: string;
    healthCheck?: string;
  };
  ui?: {
    mode?: string;
    layout?: string;
  };
  status: 'stopped' | 'starting' | 'running' | 'error';
  [key: string]: any;
}

interface ModuleRegistryState {
  modules: ModuleInfo[];
  activeModuleId: string | null;
  registerModule: (module: ModuleInfo) => void;
  setModuleStatus: (id: string, status: ModuleInfo['status']) => void;
  setActiveModule: (id: string | null) => void;
  scanModules: () => Promise<void>;
}

export const useModuleRegistry = create<ModuleRegistryState>((set) => ({
  modules: [],
  activeModuleId: null,

  registerModule: (module) =>
    set((state) => {
      if (state.modules.some((item) => item.id === module.id)) {
        return state;
      }
      return { modules: [...state.modules, module] };
    }),

  setModuleStatus: (id, status) =>
    set((state) => ({
      modules: state.modules.map((module) => (module.id === id ? { ...module, status } : module)),
    })),

  setActiveModule: (id) => set({ activeModuleId: id }),

  scanModules: async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/tauri');
      const modules = await invoke<ModuleInfo[]>('scan_modules');

      set((state) => {
        const merged = modules.map((module) => {
          const current = state.modules.find((item) => item.id === module.id);
          return {
            ...module,
            status: current?.status ?? 'stopped',
          };
        });

        return { modules: merged };
      });
    } catch (error) {
      console.error('[模块注册表] 扫描模块失败:', error);
    }
  },
}));
