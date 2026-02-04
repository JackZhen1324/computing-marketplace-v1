# Docker 部署指南

## 快速开始

### 生产环境部署

```bash
# 构建并启动生产容器
docker-compose up -d

# 访问应用
# 浏览器打开: http://localhost:3000
```

### 开发环境部署

```bash
# 构建并启动开发容器（支持热重载）
docker-compose -f docker-compose.dev.yml up -d

# 访问应用
# 浏览器打开: http://localhost:5173
```

## 命令说明

### 构建镜像

```bash
# 生产环境镜像
docker-compose build

# 开发环境镜像
docker-compose -f docker-compose.dev.yml build
```

### 启动服务

```bash
# 生产环境
docker-compose up -d

# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 容器管理

```bash
# 查看运行状态
docker-compose ps

# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' computing-marketplace-frontend

# 重启容器
docker-compose restart

# 进入容器
docker exec -it computing-marketplace-frontend sh
```

## 配置说明

### 生产环境 (docker-compose.yml)

- **端口**: 3000 (主机) → 8080 (容器)
- **镜像**: 多阶段构建，优化后的生产镜像
- **Web服务器**: Nginx Alpine
- **健康检查**: 30秒间隔，检查 /health 端点
- **重启策略**: unless-stopped

### 开发环境 (docker-compose.dev.yml)

- **端口**: 5173 (主机) → 5173 (容器)
- **镜像**: Node.js Alpine 开发环境
- **开发服务器**: Vite dev server with HMR
- **卷挂载**: 支持热重载
- **重启策略**: unless-stopped

## Nginx 配置

生产环境使用以下优化：

- **Gzip压缩**: 启用，减少传输大小
- **静态资源缓存**: 1年缓存
- **SPA路由支持**: 所有路由重定向到 index.html
- **安全头**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **健康检查**: /health 端点

## 自定义配置

### 修改端口

编辑 `docker-compose.yml`:

```yaml
ports:
  - "你的端口:8080"  # 修改左侧端口
```

### 环境变量

编辑 `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - API_URL=https://your-api.com
```

### Nginx配置

修改 `nginx.conf` 文件，然后重新构建：

```bash
docker-compose up -d --build
```

## 故障排查

### 容器无法启动

```bash
# 查看日志
docker-compose logs frontend

# 检查端口占用
lsof -i :3000
```

### 健康检查失败

```bash
# 手动健康检查
curl http://localhost:3000/health

# 查看容器状态
docker inspect computing-marketplace-frontend
```

### 构建失败

```bash
# 清理并重新构建
docker-compose down
docker system prune -f
docker-compose build --no-cache
```

## 自动化部署 (GitHub Actions CI/CD)

项目已配置 GitHub Actions 工作流，实现代码推送后自动部署到生产服务器。

### 快速开始

1. **配置 GitHub Secrets**
   - 详见 [CI-CD-SETUP.md](../CI-CD-SETUP.md)
   - 需要配置 Docker Hub、服务器 SSH 等密钥

2. **推送代码触发部署**
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

3. **查看部署状态**
   - 访问 GitHub 仓库 → **Actions** 标签
   - 查看最新的 workflow 运行状态

### 工作流程

```
Push to main → Build → Push to Docker Hub → SSH to Server → Deploy → Health Check
```

### 手动触发部署

在 GitHub 仓库页面：
1. 进入 **Actions** 标签
2. 选择 **Deploy to Production Server** workflow
3. 点击 **Run workflow** 按钮
4. 选择 **main** 分支
5. 点击 **Run workflow** 确认

### 配置文档

详细的配置步骤和故障排查，请查看:
- 📘 [CI-CD-SETUP.md](../CI-CD-SETUP.md) - 完整的 CI/CD 配置指南

## 部署到生产服务器 (手动部署)

如果你不想使用 CI/CD，也可以手动部署：

### 方法1: 使用服务器部署脚本（推荐）

```bash
# 复制脚本到服务器
scp server-deploy.sh user@server:/opt/app/

# 在服务器上执行
ssh user@server
cd /opt/app
chmod +x server-deploy.sh

# 标准部署（从 Docker Hub 拉取）
./server-deploy.sh

# 部署特定版本
IMAGE_TAG=v1.0.0 ./server-deploy.sh

# 部署时创建备份
./server-deploy.sh --backup

# 查看帮助
./server-deploy.sh --help
```

### 方法2: 使用镜像仓库

```bash
# 构建并标记镜像
docker build -t your-registry/computing-marketplace:latest .

# 推送镜像
docker push your-registry/computing-marketplace:latest

# 在服务器上拉取并运行
docker pull your-registry/computing-marketplace:latest
docker-compose up -d
```

### 方法3: 直接部署

```bash
# 复制文件到服务器
scp -r . user@server:/path/to/app

# 在服务器上构建并运行
ssh user@server
cd /path/to/app
docker-compose up -d
```

## 性能优化

### 镜像优化

- 多阶段构建减小镜像体积 (~50MB)
- 使用 Alpine 基础镜像
- 清理不必要的文件

### 运行时优化

- Nginx 高性能静态文件服务
- Gzip 压缩减少传输大小
- 静态资源长期缓存

### 资源限制

编辑 `docker-compose.yml`:

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 安全建议

1. **不要在镜像中包含敏感信息**
   - 使用 `.dockerignore` 排除 `.env` 文件
   - 通过环境变量或 secrets 管理敏感配置

2. **使用非root用户**
   - Dockerfile 已配置 `nginx-app` 用户

3. **定期更新基础镜像**
   ```bash
   docker pull node:20-alpine
   docker pull nginx:alpine
   ```

4. **扫描漏洞**
   ```bash
   docker scout caddy computing-marketplace-frontend
   ```
