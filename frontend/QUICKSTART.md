# 🚀 快速启动指南

## 最简单的方式

### 方式1: 使用脚本（推荐所有用户）

**Linux / macOS**:
```bash
# 生产环境
./start-prod.sh

# 开发环境
./start-dev.sh
```

**Windows**:
```cmd
# 生产环境
start.bat

# 开发环境
start-dev.bat
```

### 方式2: 使用 Make（推荐开发者）

```bash
# 生产环境
make prod

# 开发环境
make dev

# 查看所有命令
make help
```

### 方式3: 使用 Docker Compose

```bash
# 生产环境
docker-compose up -d

# 开发环境
docker-compose -f docker-compose.dev.yml up -d
```

## 📋 常用命令

### 启动服务

| 命令 | 说明 |
|------|------|
| `./start-prod.sh` 或 `make prod` | 启动生产环境 |
| `./start-dev.sh` 或 `make dev` | 启动开发环境（热重载） |

### 停止服务

| 命令 | 说明 |
|------|------|
| `./stop-prod.sh` 或 `make stop` | 停止生产环境 |
| `./stop-dev.sh` 或 `make stop-dev` | 停止开发环境 |

### 查看状态

| 命令 | 说明 |
|------|------|
| `./status.sh` 或 `make status` | 查看容器状态 |
| `./logs.sh` 或 `make logs` | 查看生产日志 |
| `./logs.sh dev` 或 `make logs-dev` | 查看开发日志 |

### 维护操作

| 命令 | 说明 |
|------|------|
| `./restart-prod.sh` 或 `make restart` | 重启生产环境 |
| `./cleanup.sh` 或 `make cleanup` | 清理Docker资源 |
| `make rebuild` | 重新构建镜像（无缓存） |

## 🌐 访问地址

- **生产环境**: http://localhost:3000
- **开发环境**: http://localhost:5173

## 💡 推荐工作流

### 第一次部署

```bash
# 使用完整部署脚本（包含健康检查）
./deploy.sh prod
```

### 日常开发

```bash
# 1. 启动开发环境
./start-dev.sh

# 2. 修改代码（自动热重载）

# 3. 查看日志
./logs.sh dev

# 4. 完成后停止
./stop-dev.sh
```

### 生产部署

```bash
# 完整部署流程
./deploy.sh prod

# 监控日志
./logs.sh prod

# 检查状态
./status.sh
```

## 📚 详细文档

- **[SCRIPTS.md](SCRIPTS.md)** - 所有脚本详细说明
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 完整部署指南
- **[CLAUDE.md](CLAUDE.md)** - 项目开发文档

## 🆘 遇到问题？

### 脚本无法执行（Linux/Mac）

```bash
chmod +x *.sh
```

### Docker未运行

**macOS**: 启动 Docker Desktop
**Linux**: `sudo systemctl start docker`

### 端口被占用

```bash
# 查看占用进程
lsof -i :3000

# 停止占用端口的容器
docker ps | grep 3000
docker stop <container_id>
```

### 查看详细日志

```bash
docker-compose logs --tail=100
```

## ✨ 快捷命令参考

```bash
# Make 命令（最快）
make prod              # 启动生产
make dev               # 启动开发
make stop              # 停止生产
make status            # 查看状态
make logs              # 查看日志
make cleanup           # 清理资源
make rebuild           # 重新构建
make all               # 完整重建并启动

# 脚本命令（最直观）
./start-prod.sh        # 启动生产
./start-dev.sh         # 启动开发
./stop-prod.sh         # 停止生产
./status.sh            # 查看状态
./logs.sh              # 查看日志
./cleanup.sh           # 清理资源
./deploy.sh prod       # 完整部署

# Docker 命令（最灵活）
docker-compose up -d   # 启动生产
docker-compose down    # 停止生产
docker-compose ps      # 查看状态
docker-compose logs -f # 查看日志
```

选择你喜欢的方式开始吧！ 🎉
