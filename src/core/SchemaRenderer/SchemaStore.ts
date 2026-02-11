import { create } from 'zustand';

interface SchemaStore {
  // 存储组件值，例如：{ "server_name": "MyServer", "enable_logs": true }
  values: Record<string, any>;

  // 更新某个字段
  setValue: (id: string, value: any) => void;

  // 批量初始化
  initValues: (initial: Record<string, any>) => void;

  // 清空状态
  reset: () => void;
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  values: {},

  setValue: (id, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [id]: value,
      },
    })),

  initValues: (initial) => set({ values: initial }),

  reset: () => set({ values: {} }),
}));
