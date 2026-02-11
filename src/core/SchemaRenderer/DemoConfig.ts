export const demoLayout = `
[
  {
    "type": "container",
    "label": "基础设置 (Basic Settings)",
    "children": [
      {
        "type": "input",
        "id": "server_name",
        "label": "服务器名称",
        "props": { "placeholder": "请输入服务器名称..." }
      },
      {
        "type": "toggle",
        "id": "enable_logs",
        "label": "启用详细日志",
        "props": { "defaultChecked": true }
      },
      {
        "type": "segmentedControl",
        "id": "mode",
        "label": "启动模式",
        "props": {
          "value": "dev",
          "options": [
            { "value": "dev", "label": "开发模式" },
            { "value": "prod", "label": "生产环境" },
            { "value": "test", "label": "测试沙箱" }
          ]
        }
      }
    ]
  },
  {
    "type": "container",
    "label": "高级参数 (Advanced)",
    "children": [
      {
        "type": "slider",
        "id": "max_connections",
        "label": "最大连接数",
        "props": { 
          "min": 1, 
          "max": 100, 
          "defaultValue": 20,
          "step": 1
        }
      },
      {
        "type": "select",
        "id": "region",
        "label": "部署区域",
        "props": {
          "value": "cn-east",
          "options": [
            { "value": "cn-east", "label": "华东 (CN-EAST)" },
            { "value": "cn-north", "label": "华北 (CN-NORTH)" },
            { "value": "us-west", "label": "美西 (US-WEST)" }
          ]
        }
      },
      {
        "type": "modal",
        "label": "查看详细配置",
        "props": { "description": "点击查看 json 完整配置" },
        "children": [
            {
                "type": "label",
                "label": "这里是模态框内部的内容！你可以无限嵌套。"
            },
            {
                "type": "button",
                "label": "确认修改",
                "props": { "variant": "primary" }
            }
        ]
      }
    ]
  }
]
`;
