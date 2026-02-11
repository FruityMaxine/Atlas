#!/usr/bin/env python3
"""
网页爬虫模块 - 后端服务
这是一个 Atlas 声明式模块的后端示例
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import argparse
import requests
from bs4 import BeautifulSoup
import time

app = Flask(__name__)
CORS(app)  # 允许跨域访问

# ===== 健康检查接口 (必须) =====
@app.route('/health', methods=['GET'])
def health():
    """健康检查端点，用于 Atlas 检测服务是否就绪"""
    return jsonify({
        'status': 'ok',
        'module': 'crawler-example',
        'timestamp': int(time.time())
    })


# ===== 爬虫业务接口 =====
@app.route('/api/crawl', methods=['POST'])
def start_crawling():
    """
    开始爬取
    请求体示例:
    {
        "target_url": "https://example.com",
        "crawl_depth": 2,
        "max_workers": 3,
        "use_proxy": false,
        "enable_js": false,
        "user_agent": "chrome",
        "content_type": "text"
    }
    """
    try:
        data = request.json
        target_url = data.get('target_url')
        depth = data.get('crawl_depth', 1)
        
        # 简单爬取示例 (生产环境应使用更复杂的逻辑)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(target_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 提取标题和链接
        title = soup.title.string if soup.title else '无标题'
        links = [a.get('href') for a in soup.find_all('a', href=True)][:20]
        
        return jsonify({
            'success': True,
            'data': {
                'title': title,
                'url': target_url,
                'links_count': len(links),
                'links': links,
                'depth_used': depth
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ===== 获取爬取进度 =====
@app.route('/api/progress', methods=['GET'])
def get_progress():
    """获取当前爬取进度（示例接口）"""
    return jsonify({
        'current': 5,
        'total': 100,
        'percentage': 5,
        'status': 'running'
    })


if __name__ == '__main__':
    # 解析端口参数
    parser = argparse.ArgumentParser(description='Crawler Backend Service')
    parser.add_argument('--port', type=int, required=True, help='服务端口')
    args = parser.parse_args()
    
    print(f"🚀 爬虫服务启动中...")
    print(f"📡 监听端口: {args.port}")
    print(f"🔗 健康检查: http://127.0.0.1:{args.port}/health")
    
    # 启动 Flask 服务
    app.run(
        host='127.0.0.1',
        port=args.port,
        debug=False
    )
