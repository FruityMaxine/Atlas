/*
 * 模块注册表
 *
 * 功能说明：
 * - 维护已加载模块的信息
 * - 提供模块查询接口
 * - Zustand 状态管理
 *
 * State 结构：
 * ```typescript
 * interface ModuleRegistryState {
 *   modules: ModuleInfo[];          // 所有模块列表
 *   activeModuleId: string | null;  // 当前活动模块
 *   loadModule: (id: string) => Promise<void>;
 *   unloadModule: (id: string) => void;
 *   setActiveModule: (id: string) => void;
 *   refreshModules: () => Promise<void>;
 * }
 * ```
 *
 * ModuleInfo 结构：
 * ```typescript
 * interface ModuleInfo {
 *   id: string;
 *   name: string;
 *   version: string;
 *   author: string;
 *   description: string;
 *   icon: string;
 *   status: 'stopped' | 'starting' | 'running' | 'error';
 * }
 * ```
 *
 * 使用示例：
 * ```typescript
 * const { modules, activeModuleId, setActiveModule } = useModuleRegistry();
 * ```
 */

// TODO: 定义 ModuleInfo 接口
// TODO: 创建 Zustand store
// TODO: 实现模块管理方法
