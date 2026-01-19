/*
 * API 客户端
 *
 * 功能说明：
 * - 提供统一的 HTTP 请求接口
 * - 用于前端调用模块后端 API
 * - 封装 axios 或 fetch
 *
 * 主要方法：
 * 1. get(url, config)
 * 2. post(url, data, config)
 * 3. put(url, data, config)
 * 4. delete(url, config)
 *
 * 特性：
 * - 自动添加请求头
 * - 统一错误处理
 * - 请求/响应拦截器
 * - 超时处理
 *
 * 使用示例：
 * ```typescript
 * import { apiClient } from '@/core/ApiClient';
 *
 * // GET 请求
 * const data = await apiClient.get('http://localhost:8080/api/status');
 *
 * // POST 请求
 * const result = await apiClient.post('http://localhost:8080/api/scrape', {
 *   url: 'https://example.com'
 * });
 * ```
 *
 * 提供给模块使用：
 * - 模块可以通过 import { apiClient } from '@atlas/core' 使用
 */

// TODO: 创建 ApiClient 类
// TODO: 实现 HTTP 方法
// TODO: 实现错误处理
// TODO: 导出单例实例
