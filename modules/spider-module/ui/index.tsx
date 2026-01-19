/*
 * 爬虫模块 - UI 组件
 *
 * 功能说明：
 * - 爬虫模块的前端界面
 * - 用户输入 URL
 * - 展示爬取结果
 *
 * 组件结构：
 * 1. 输入区域
 *    - URL 输入框
 *    - 开始按钮
 *    - 选项设置（可选）
 *
 * 2. 结果展示区
 *    - 标题
 *    - 正文内容
 *    - 链接列表
 *    - 图片列表
 *
 * 3. 状态显示
 *    - 加载动画
 *    - 错误提示
 *    - 成功提示
 *
 * API 调用：
 * ```typescript
 * import { apiClient } from '@atlas/core';
 *
 * const result = await apiClient.post('http://localhost:8080/api/scrape', {
 *   url: targetUrl
 * });
 * ```
 *
 * Props:
 * - 无（独立组件）
 *
 * State:
 * - url: string (用户输入的 URL)
 * - loading: boolean (加载状态)
 * - result: any (爬取结果)
 * - error: string | null (错误信息)
 */

// TODO: 实现 SpiderUI 组件
// TODO: 使用 MUI 组件（TextField, Button, Card）
// TODO: 实现输入框和按钮
// TODO: 调用后端 API
// TODO: 展示结果
// TODO: 错误处理
