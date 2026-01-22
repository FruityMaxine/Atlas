/**
 * 导航上下文
 * 
 * 用途：提供全局的页面导航能力
 * 允许任何组件通过 useNavigation() 钩子获取当前页面并进行跳转
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 导航上下文接口定义
interface NavigationContextType {
    currentPage: string;
    navigateTo: (pageId: string) => void;
}

// 创建 Context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Provider 组件属性
interface NavigationProviderProps {
    children: ReactNode;
    defaultPage?: string;
}

// 导航 Provider 组件
export function NavigationProvider({ children, defaultPage = 'home' }: NavigationProviderProps) {
    const [currentPage, setCurrentPage] = useState(defaultPage);

    const navigateTo = (pageId: string) => {
        setCurrentPage(pageId);
    };

    return (
        <NavigationContext.Provider value={{ currentPage, navigateTo }}>
            {children}
        </NavigationContext.Provider>
    );
}

// 自定义 Hook：使用导航
export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}
