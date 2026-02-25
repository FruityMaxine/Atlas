export const demoLayout = `
[
  {
    "type": "container",
    "label": "代理模式 (Proxy Settings)",
    "props": { "icon": "Globe" },
    "children": [
      {
        "type": "segmentedControl",
        "id": "proxy_mode",
        "label": "系统代理模式",
        "props": {
          "icon": "Router",
          "description": "全局或按规则路由流量",
          "value": "rule",
          "options": [
            { "value": "direct", "label": "直连" },
            { "value": "rule", "label": "规则" },
            { "value": "global", "label": "全局" }
          ]
        }
      },
      {
        "type": "toggle",
        "id": "tun_mode",
        "label": "TUN 虚拟网卡",
        "props": { 
          "icon": "ShieldCheck",
          "description": "代理所有发往 IP 的流量（需要管理员权限）",
          "defaultChecked": false 
        }
      },
      {
        "type": "slider",
        "id": "timeout",
        "label": "请求超时时间",
        "hidden": "!$tun_mode",
        "props": { 
          "icon": "Timer",
          "description": "所有网络请求的全局超时拦截（毫秒）",
          "min": 1000, 
          "max": 10000, 
          "defaultValue": 3000,
          "step": 500,
          "unit": " ms",
          "mode": "input"
        }
      }
    ]
  },
  {
    "type": "container",
    "label": "外部控制与模块同步",
    "props": { "icon": "Settings" },
    "children": [
      {
        "type": "input",
        "id": "external_controller",
        "label": "外部控制端口",
        "props": { 
          "icon": "Radio",
          "description": "Restful API 的监听地址",
          "placeholder": "127.0.0.1:9090",
          "defaultValue": "127.0.0.1:9090"
        }
      },
      {
        "type": "select",
        "id": "loglevel",
        "label": "日志输出级别",
        "props": {
          "icon": "AlignLeft",
          "description": "调整框架输出控制台的日志详细度",
          "value": "info",
          "options": [
            { "value": "debug", "label": "调试 (Debug)" },
            { "value": "info", "label": "信息 (Info)" },
            { "value": "warning", "label": "警告 (Warning)" },
            { "value": "error", "label": "错误 (Error)" }
          ]
        }
      },
      {
        "type": "input",
        "id": "custom_rules",
        "label": "自动覆盖规则集",
        "props": {
           "icon": "FileCode",
           "description": "每行一条直连或代理域名配置",
           "multiline": true,
           "rows": 4,
           "placeholder": "DOMAIN-SUFFIX,google.com,PROXY\\nDOMAIN-SUFFIX,baidu.com,DIRECT"
        }
      },
      {
        "type": "modal",
        "label": "高级安全设置",
        "props": { "icon": "Lock", "description": "证书验证、强制 HTTPS 与 DNS 排障" },
        "children": [
            {
                "type": "toggle",
                "id": "force_https",
                "label": "强制升级 HTTPS",
                "props": { "defaultChecked": true }
            },
            {
                "type": "toggle",
                "id": "skip_cert",
                "label": "跳过证书验证 (Insecure)",
                "props": { "defaultChecked": false }
            },
            {
                "type": "button",
                "label": "清除系统 DNS 缓存",
                "props": { "variant": "danger", "onClick": "flush_dns", "style": {"marginTop": "10px"} }
            }
        ]
      }
    ]
  },
  {
      "type": "button",
      "label": "应用配置并重启内核",
      "props": { "variant": "primary", "onClick": "restart_core" }
  }
]
`;
