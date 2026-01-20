/**
 * i18n 国际化配置文件
 * 
 * 用途：配置 react-i18next，支持中英文切换
 * 
 * 初学者说明：
 * - i18next 是国际化（i18n）的核心库
 * - react-i18next 是 React 的绑定（让 React 组件能使用翻译）
 * - 翻译文件存储在 src/locales/ 目录
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from '../locales/zh-CN.json';
import enUS from '../locales/en-US.json';
import lolUS from '../locales/lol-US.json';
import enUD from '../locales/en-UD.json';
import tlh from '../locales/tlh.json';

// 初始化 i18next
i18n
    // 使用 react-i18next 插件（让 React 组件能使用翻译）
    .use(initReactI18next)
    // 配置选项
    .init({
        // ===== 翻译资源 =====
        /**
         * resources 定义所有语言的翻译内容
         * 
         * 格式：
         * {
         *   '语言代码': { translation: 翻译JSON },
         *   ...
         * }
         */
        resources: {
            'zh-CN': {
                translation: zhCN  // 中文翻译
            },
            'en-US': {
                translation: enUS  // 英文翻译
            },
            'lol-US': {
                translation: lolUS // LOLCAT
            },
            'en-UD': {
                translation: enUD // Upside-Down
            },
            'tlh': {
                translation: tlh // Klingon
            },
        },

        // ===== 默认语言 =====
        lng: 'zh-CN',  // 应用启动时使用的语言

        // ===== 回退语言 =====
        /**
         * 当某个翻译键找不到时，使用此语言作为备选
         * 例如：如果英文翻译缺失某个键，会显示中文
         */
        fallbackLng: 'zh-CN',

        // ===== 插值配置 =====
        /**
         * interpolation 控制变量插值的行为
         * escapeValue: false 表示不转义 HTML（React 会自动处理）
         */
        interpolation: {
            escapeValue: false,  // React 已经防止 XSS 攻击
        },

        // ===== 调试模式 =====
        /**
         * 开发时可以开启，显示缺失的翻译键
         * 生产环境应该关闭
         */
        debug: true,
    });

/**
 * 导出 i18n 实例
 * 
 * 其他文件可以导入这个实例来：
 * - 切换语言：i18n.changeLanguage('en-US')
 * - 获取当前语言：i18n.language
 * - 获取翻译：i18n.t('settings.title')
 */
export default i18n;

/**
 * 使用示例（在组件中）：
 * 
 * import { useTranslation } from 'react-i18next';
 * 
 * function MyComponent() {
 *   const { t } = useTranslation();
 *   return <h1>{t('settings.title')}</h1>;
 * }
 */
