/**
 * SettingsContext - 全局设置管理
 * 
 * 用途：统一管理所有应用设置，避免设置分散在不同组件中
 * 
 * 使用方式：
 * 1. 在 App.tsx 中用 <SettingsProvider> 包裹应用
 * 2. 在任何组件中使用 useSettings() Hook 访问设置
 * 
 * 初学者说明：
 * - Context 是 React 提供的"全局数据仓库"
 * - 类似于一个所有组件都能访问的"公共储物柜"
 * - 不用一层层传递 props，直接 useSettings() 就能拿到数据
 */

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import i18n from '../i18n/config';  // 导入 i18n 实例

// ===== 1. 定义设置的类型（TypeScript 接口） =====
/**
 * 这个接口定义了所有可用的设置项
 * 
 * 初学者提示：
 * - interface 是 TypeScript 的类型定义
 * - boolean 表示 true/false 的开关
 * - () => void 表示"没有参数、没有返回值的函数"
 */
interface SettingsContextType {
    // ===== 设置值 =====
    mouseAnimation: boolean;        // 鼠标动画开关
    language: string;               // 语言
    autoStart: boolean;             // 自动启动
    silentStart: boolean;           // 静默启动
    enableNotification: boolean;    // 通知
    soundEnabled: boolean;          // 声音
    downloadPath: string;           // 下载路径
    maxConcurrent: string;          // 最大并发
    autoBackup: boolean;            // 自动备份
    backupInterval: string;         // 备份间隔
    autoClean: boolean;             // 自动清理
    cleanInterval: number;          // 清理间隔（天数）
    cleanSize: number;              // 清理大小（GB）
    enableComponentPage: boolean;   // 组件页面
    // ===== 设置更新函数 =====
    setMouseAnimation: (value: boolean) => void;  // 修改鼠标动画的函数
    setLanguage: (value: string) => void;   // 修改语言的函数
    setAutoStart: (value: boolean) => void; // 修改自动启动的函数
    setSilentStart: (value: boolean) => void; // 修改静默启动的函数
    setEnableNotification: (value: boolean) => void; // 修改通知的函数
    setSoundEnabled: (value: boolean) => void; // 修改声音的函数
    setDownloadPath: (value: string) => void; // 修改下载路径的函数
    setMaxConcurrent: (value: string) => void;  // 修改最大并发的函数
    setAutoBackup: (value: boolean) => void; // 修改自动备份的函数
    setBackupInterval: (value: string) => void; // 修改备份间隔的函数
    setAutoClean: (value: boolean) => void; // 修改自动清理的函数
    setCleanInterval: (value: number) => void; // 修改清理间隔的函数
    setCleanSize: (value: number) => void; // 修改清理大小的函数
    setEnableComponentPage: (value: boolean) => void; // 修改组件页面的函数
}

// ===== 2. 创建 Context 对象 =====
/**
 * createContext 创建一个"数据仓库"
 * 
 * 初学者提示：
 * - undefined 表示初始值为空（必须用 Provider 包裹才有值）
 * - 后面的 ! 告诉 TypeScript "我保证会提供值，别担心"
 */
const SettingsContext = createContext<SettingsContextType>(undefined!);

// ===== 3. Provider 组件（数据提供者） =====
/**
 * SettingsProvider 是一个"包装纸"组件
 * 用它包住的所有子组件都能访问设置数据
 * 
 * 初学者提示：
 * - children 是 React 特殊的 props，表示"被包裹的内容"
 * - useState 创建状态，就像一个"可以改变的变量"
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
    // ===== 状态定义 =====
    /**
     * useState 的格式：
     * const [变量名, 修改函数] = useState(初始值)
     * 
     * 例子：[mouseAnimation, setMouseAnimation] = useState(true)
     * - mouseAnimation 是当前值（true 表示开启）
     * - setMouseAnimation 是修改函数
     * - useState(true) 表示初始值是 true
     */

    // 系统设置
    const [language, setLanguage] = useState('zh-CN');  // 默认语言为中文
    const [autoStart, setAutoStart] = useState(false);  // 默认不自动启动
    const [silentStart, setSilentStart] = useState(false);  // 默认不静默启动
    const [mouseAnimation, setMouseAnimation] = useState(true);  // 默认开启鼠标动画

    // 基础设置 - 通知
    const [enableNotification, setEnableNotification] = useState(true);  // 默认开启通知
    const [soundEnabled, setSoundEnabled] = useState(false);  // 默认关闭声音

    // 基础设置 - 下载
    const [downloadPath, setDownloadPath] = useState('./downloads');  // 默认下载路径
    const [maxConcurrent, setMaxConcurrent] = useState('3');  // 默认最大并发

    // 基础设置 - 备份
    const [autoBackup, setAutoBackup] = useState(false);  // 默认不自动备份
    const [backupInterval, setBackupInterval] = useState('daily');  // 默认备份间隔

    // 基础设置 - 文件管理
    const [autoClean, setAutoClean] = useState(false);  // 默认不自动清理
    const [cleanInterval, setCleanInterval] = useState(7);  // 默认清理间隔（7天）
    const [cleanSize, setCleanSize] = useState(1);  // 默认清理大小（1GB）

    // 开发者选项
    const [enableComponentPage, setEnableComponentPage] = useState(false);  // 默认不启用组件页面

    // ===== 连接 i18n =====
    /**
     * 当 language 改变时，同步到 i18n
     * 这样 useTranslation() 会自动使用新语言
     */
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);



    // ===== 组装数据对象 =====
    /**
     * value 对象包含了所有设置数据和修改函数
     * 这个对象会被传递给所有使用 useSettings() 的组件
     */
    const value: SettingsContextType = {
        mouseAnimation,
        setMouseAnimation,
        language,
        setLanguage,
        autoStart,
        setAutoStart,
        silentStart,
        setSilentStart,
        enableNotification,
        setEnableNotification,
        soundEnabled,
        setSoundEnabled,
        downloadPath,
        setDownloadPath,
        maxConcurrent,
        setMaxConcurrent,
        autoBackup,
        setAutoBackup,
        backupInterval,
        setBackupInterval,
        autoClean,
        setAutoClean,
        cleanInterval,
        setCleanInterval,
        cleanSize,
        setCleanSize,
        enableComponentPage,
        setEnableComponentPage,
    };

    // ===== 返回 Provider 组件 =====
    /**
     * <SettingsContext.Provider value={value}>
     * 这一行把数据"注入"到 Context 中
     * 
     * 初学者提示：
     * - Provider 是"提供者"，负责存储数据
     * - value 属性是要共享的数据
     * - {children} 是被包裹的子组件
     */
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

// ===== 4. 自定义 Hook - useSettings =====
/**
 * useSettings 是一个"便捷工具"
 * 让其他组件更方便地获取设置数据
 * 
 * 使用示例：
 * const { mouseAnimation, setMouseAnimation } = useSettings();
 * 
 * 初学者提示：
 * - useContext 是 React 提供的 Hook，用来"读取" Context 数据
 * - 这个函数没有参数，调用后返回设置对象
 */
export function useSettings() {
    // useContext 从 SettingsContext 中读取数据
    const context = useContext(SettingsContext);

    // 如果没有用 Provider 包裹，会报错提醒开发者
    if (!context) {
        throw new Error('useSettings 必须在 SettingsProvider 内部使用');
    }

    return context;
}

/**
 * 总结（给初学者）：
 * 
 * 这个文件创建了一个"全局设置中心"：
 * 
 * 1. SettingsProvider  → 包裹应用，提供数据
 * 2. useSettings()     → 任何组件都能调用，获取设置
 * 3. mouseAnimation    → 鼠标动画开关（true/false）
 * 4. setMouseAnimation → 修改鼠标动画的函数
 * 
 * 使用流程：
 * App.tsx:        <SettingsProvider><App内容></SettingsProvider>
 * SettingsPage:   const { mouseAnimation, setMouseAnimation } = useSettings();
 * TargetCursor:   const { mouseAnimation } = useSettings();
 */
