# 部署架构说明

## 端口统一架构

整个系统通过 **9210** 端口统一对外提供服务，nginx负责反向代理。

### 架构图

```
┌─────────────────────────────────────────┐
│         用户浏览器                      │
│  访问: http://your-server:9210         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Nginx (端口 9210)              │
│  frontend container → 8080 → 9210      │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────────┐
│  静态资源    │  │   API代理        │
│  HTML/CSS/JS │  │   /api/*         │
└─────────────┘  └──────┬───────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  后端服务         │
               │  localhost:3000 │
               └─────────────────┘
```

### 访问路径

| 路径 | 说明 | 处理方式 |
|------|------|----------|
| `http://server:9210/` | 前端首页 | nginx返回静态文件 |
| `http://server:9210/products` | 产品页面 | nginx返回index.html（React Router处理） |
| `http://server:9210/api/products` | 产品API | nginx代理到后端3000端口 |
| `http://server:9210/api/solutions` | 方案API | nginx代理到后端3000端口 |
| `http://server:9210/api/inquiries` | 咨询API | nginx代理到后端3000端口 |

### 环境配置

#### 前端 (.env.production)
```bash
VITE_API_BASE_URL=/api
```
使用相对路径，请求会发送到当前域名下的 `/api/*`

#### Nginx (nginx.conf)
```nginx
location /api/ {
    proxy_pass http://host.docker.internal:3000;
    # ... 其他代理配置
}
```
将 `/api/*` 请求代理到宿主机的后端服务

#### 后端 (app.ts)
- 动态CORS验证
- 允许localhost所有端口（开发环境）
- 允许配置的域名列表（生产环境）

### Docker容器配置

```yaml
# frontend/docker-compose.yml
services:
  frontend:
    ports:
      - "9210:8080"  # 宿主机9210映射到容器8080
    networks:
      - app-network
```

后端服务运行在宿主机（非Docker容器），端口3000不对外暴露。

### 优势

1. **统一入口** - 只暴露一个端口（9210）
2. **同源策略** - 前后端同源，无CORS问题
3. **安全性高** - 后端端口不直接暴露
4. **易于管理** - 统一通过nginx管理所有流量
5. **便于部署** - 符合生产环境最佳实践

### 开发环境 vs 生产环境

| 环境 | 前端地址 | 后端地址 | API访问方式 |
|------|---------|---------|-------------|
| 开发 | `http://localhost:5177` | `http://localhost:3000` | 直接访问 |
| 生产 | `http://server:9210` | `http://localhost:3000` | nginx代理 |

### 故障排查

#### API请求失败
1. 检查nginx容器是否正常运行
2. 检查后端服务是否在3000端口运行
3. 检查nginx日志：`docker logs computing-marketplace-frontend`
4. 检查后端日志：查看 `/tmp/backend.log`

#### CORS错误
1. 确认前端使用 `/api` 相对路径
2. 检查后端CORS配置是否包含访问来源
3. 查看后端日志中的CORS警告信息

#### 样式丢失
1. 确认vite.config.ts中设置了 `base: './'`
2. 检查浏览器控制台是否正确加载CSS文件
3. 清除浏览器缓存后重试
