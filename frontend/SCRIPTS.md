# 一键启动脚本使用指南

## 🚀 快速开始

### Linux / macOS

**生产环境（一键启动）**:
```bash
./start-prod.sh
```

**开发环境（支持热重载）**:
```bash
./start-dev.sh
```

### Windows

**生产环境**:
```cmd
start.bat
```

**开发环境**:
```cmd
start-dev.bat
```

## 📋 所有脚本说明

### 主要脚本

| 脚本 | 说明 | 适用系统 |
|------|------|----------|
| `start-prod.sh` | 启动生产环境 | Linux/macOS |
| `start-dev.sh` | 启动开发环境（热重载） | Linux/macOS |
| `stop-prod.sh` | 停止生产环境 | Linux/macOS |
| `stop-dev.sh` | 停止开发环境 | Linux/macOS |
| `restart-prod.sh` | 重启生产环境 | Linux/macOS |
| `deploy.sh` | 完整部署（构建+测试+启动） | Linux/macOS |
| `start.bat` | 启动生产环境 | Windows |
| `stop.bat` | 停止生产环境 | Windows |
| `start-dev.bat` | 启动开发环境 | Windows |
| `stop-dev.bat` | 停止开发环境 | Windows |

### 辅助脚本

| 脚本 | 说明 | 用法 |
|------|------|------|
| `logs.sh` | 查看实时日志 | `./logs.sh [prod\|dev]` |
| `status.sh` | 查看容器状态 | `./status.sh` |
| `cleanup.sh` | 清理Docker资源 | `./cleanup.sh` |
| `logs.bat` | 查看日志（Windows） | 双击运行 |
| `status.bat` | 查看状态（Windows） | 双击运行 |
| `cleanup.bat` | 清理资源（Windows） | 双击运行 |

## 💡 使用场景

### 场景1: 第一次部署

```bash
# 方式1: 使用一键启动脚本（推荐）
./start-prod.sh

# 方式2: 使用完整部署脚本（包含健康检查）
./deploy.sh prod
```

### 场景2: 日常开发

```bash
# 启动开发环境（支持热重载）
./start-dev.sh

# 修改代码后自动刷新
# 查看日志
./logs.sh dev

# 完成后停止
./stop-dev.sh
```

### 场景3: 生产部署

```bash
# 完整部署（推荐用于生产）
./deploy.sh prod

# 脚本会自动执行：
# 1. 停止旧容器
# 2. 清理旧构建
# 3. 构建新镜像
# 4. 启动容器
# 5. 健康检查（30次重试）
```

### 场景4: 快速重启

```bash
# 重启生产环境
./restart-prod.sh

# 或者
docker-compose restart
```

### 场景5: 查看状态和日志

```bash
# 查看所有容器状态
./status.sh

# 查看生产环境日志
./logs.sh prod

# 查看开发环境日志
./logs.sh dev

# 或者直接使用docker-compose
docker-compose logs -f
```

### 场景6: 清理资源

```bash
# 清理脚本（会交互式询问）
./cleanup.sh

# 会询问：
# 1. 是否删除镜像
# 2. 是否执行 docker system prune
```

## 🛠️ 脚本功能详解

### start-prod.sh

**功能**:
- ✅ 检查Docker是否运行
- ✅ 停止旧容器
- ✅ 构建新镜像
- ✅ 启动容器
- ✅ 显示访问地址

**输出**:
```
🚀 启动算力超市前端 - 生产环境
================================
🛑 停止旧容器...
🔨 构建镜像...
▶️  启动容器...
⏳ 等待服务启动...

✅ 部署完成！
🌐 访问地址: http://localhost:3000
```

### deploy.sh

**功能**: 完整部署流程，适合生产环境

**步骤**:
1. 停止旧容器
2. 清理旧构建缓存
3. 构建新镜像（--no-cache）
4. 启动容器
5. 健康检查（最多30次，每次2秒）

**用法**:
```bash
./deploy.sh prod   # 生产环境
./deploy.sh dev    # 开发环境
```

### status.sh

**显示**:
- 生产环境容器状态
- 开发环境容器状态
- Docker镜像信息
- 磁盘使用情况

**输出示例**:
```
📊 算力超市前端 - 容器状态
================================

🔷 生产环境:
  NAME                                    STATUS
  computing-marketplace-frontend          Up 2 hours (healthy)

🔶 开发环境:
  未运行

🖥️  Docker镜像:
  computing-marketplace:test - 151MB - 2 hours ago

💾 磁盘使用:
  Images: 15 items, 2.5GB
```

## ⚙️ 自定义配置

### 修改端口

编辑对应的脚本文件，找到端口配置：

```bash
# start-prod.sh
PORT="3000"  # 修改为你的端口
```

或在 docker-compose.yml 中修改：
```yaml
ports:
  - "你的端口:8080"
```

### 修改健康检查超时

编辑 `deploy.sh`:
```bash
MAX_ATTEMPTS=30  # 最大尝试次数
# 每次间隔2秒
```

## 🐛 故障排查

### 脚本无法执行

```bash
# 添加可执行权限
chmod +x *.sh
```

### Docker未运行

```bash
# macOS: 启动 Docker Desktop
open -a Docker

# Linux: 启动 Docker 服务
sudo systemctl start docker
```

### 端口被占用

```bash
# 查看占用端口的进程
lsof -i :3000

# 停止占用端口的容器
docker ps | grep 3000
docker stop <container_id>
```

### 容器启动失败

```bash
# 查看详细日志
docker-compose logs --tail=100

# 重新构建
docker-compose build --no-cache
```

## 📝 脚本对比

| 任务 | docker-compose 命令 | 脚本 | 优势 |
|------|---------------------|------|------|
| 启动生产环境 | `docker-compose up -d --build` | `./start-prod.sh` | 友好提示，状态显示 |
| 完整部署 | 手动执行多个命令 | `./deploy.sh prod` | 自动化健康检查 |
| 查看状态 | `docker-compose ps` | `./status.sh` | 同时显示开发/生产状态 |
| 清理资源 | 手动执行多个命令 | `./cleanup.sh` | 交互式确认，安全 |

## 🎯 推荐工作流

### 开发工作流

```bash
# 1. 启动开发环境
./start-dev.sh

# 2. 开始开发（代码自动热重载）
# ...

# 3. 查看日志（可选）
./logs.sh dev

# 4. 完成后停止
./stop-dev.sh
```

### 部署工作流

```bash
# 1. 测试环境部署
./deploy.sh dev

# 2. 验证功能
# 访问 http://localhost:5173

# 3. 生产环境部署
./deploy.sh prod

# 4. 监控日志
./logs.sh prod

# 5. 检查状态
./status.sh
```

## 📞 获取帮助

查看每个脚本的详细用法：
```bash
# 大多数脚本都支持 --help 参数
./deploy.sh --help
```

查看 [DEPLOYMENT.md](DEPLOYMENT.md) 获取更多部署细节。
