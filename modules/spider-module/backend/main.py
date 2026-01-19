"""
爬虫模块 - 后端服务入口

功能说明：
- Flask HTTP 服务器
- 提供 RESTful API 接口
- 静默运行（无窗口）
- 支持 CORS 跨域请求

API 接口：
1. GET /api/status
   - 健康检查接口
   - 返回服务状态

2. POST /api/scrape
   - 爬取网页接口
   - 请求数据：{ "url": "https://example.com" }
   - 返回数据：{ "success": true, "data": {...} }

3. GET /api/config
   - 获取配置信息

启动方式：
python main.py --server-mode --port 8080

注意事项：
- 需要安装依赖：pip install flask flask-cors requests beautifulsoup4
- Windows 下会被 Atlas 以静默方式启动（无命令行窗口）
"""

# TODO: 导入 Flask 和其他依赖
# TODO: 创建 Flask app
# TODO: 配置 CORS
# TODO: 实现 API 路由
# TODO: 实现 main 函数（解析命令行参数）
# TODO: 运行服务器
