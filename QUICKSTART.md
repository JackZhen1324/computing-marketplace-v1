# 快速启动指南

## Docker 一键部署（推荐）

所有服务运行在Docker容器中，前后端自动通信。

### 启动所有服务

```bash
# 在项目根目录执行
docker-compose up -d
```

### 服务访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:9210 | 主页面 |
| 后端API | http://localhost:3000 | API健康检查: http://localhost:3000/health |
| 数据库管理 | http://localhost:8081 | Adminer |
| PostgreSQL | localhost:5434 | 数据库连接 |
| Redis | localhost:6379 | 缓存服务 |

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据库数据）
docker-compose down -v
```

### 重启服务

```bash
docker-compose restart
```

## 开发环境启动

如果不想使用Docker，可以分别启动前后端：

### 后端

```bash
cd backend
# 启动数据库
docker-compose up -d postgres redis

# 安装依赖
npm install

# 运行数据库迁移
npm run prisma:migrate
npm run prisma:generate

# 填充初始数据
npm run seed
npm run seed-extra

# 启动后端
npm run dev
```

### 前端

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5177
```

## 默认账号

- **管理员**: admin@computing-marketplace.com / Admin@123
- **测试用户**: customer@example.com / Customer@123

## 故障排查

### 502错误

```bash
# 检查服务状态
docker-compose ps

# 检查后端日志
docker-compose logs backend

# 重启服务
docker-compose restart backend
```

### 数据库连接失败

```bash
# 检查数据库容器
docker-compose ps postgres

# 重启数据库
docker-compose restart postgres
```

### 端口冲突

如果端口被占用，修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "新端口:容器端口"
```
