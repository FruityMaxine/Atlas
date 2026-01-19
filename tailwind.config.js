/** @type {import('tailwindcss').Config} */
/* 
 * TailwindCSS 配置文件
 * 
 * 功能说明：
 * - 配置 Tailwind 样式
 * - 定义自定义颜色
 * - 定义自定义工具类
 * 
 * ClashVerge 风格配色：
 * - primary: 蓝色 #3B82F6
 * - secondary: 紫色 #8B5CF6
 * - dark: 深蓝灰 #1A1B26
 */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                secondary: '#8B5CF6',
                dark: '#1A1B26',
                paper: '#24283B',
            },
            backdropBlur: {
                'glass': '20px',
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
