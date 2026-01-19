import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // 从 localStorage 读取保存的主题
        const saved = localStorage.getItem('theme') as Theme;
        if (saved) {
            applyTheme(saved);
            setTheme(saved);
        } else {
            // 默认使用深色主题
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        if (newTheme === 'auto') {
            // 跟随系统主题
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    };

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    return { theme, changeTheme };
}
