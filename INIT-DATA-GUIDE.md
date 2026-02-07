# 数据库初始化指南

## 快速开始

### 本地环境初始化

如果你在本地运行Docker容器：

```bash
# 一键初始化本地数据库
./init-local-data.sh
```

### 远程服务器初始化

#### 方法1: 使用自动脚本（推荐）

```bash
# 语法: ./init-remote-data.sh <服务器地址> [SSH用户] [SSH端口]

# 示例1: 使用默认用户(root)和端口(22)
./init-remote-data.sh your-server.com

# 示例2: 指定用户和端口
./init-remote-data.sh 192.168.1.100 ubuntu 22

# 示例3: 使用非默认SSH端口
./init-remote-data.sh your-server.com root 8222
```

脚本会自动：
1. 检查容器状态
2. 执行基础seed数据
3. 执行额外seed数据
4. 验证数据是否成功插入
5. 显示最新日志

#### 方法2: 手动SSH执行

```bash
# SSH到服务器
ssh -p 8222 root@your-server.com

# 执行seed命令
docker exec computing-marketplace-backend npx tsx scripts/seed.ts
docker exec computing-marketplace-backend npx tsx scripts/seed-extra.ts

# 查看日志
docker logs computing-marketplace-backend --tail 30
```

#### 方法3: 单行命令执行

```bash
# 通过SSH远程执行
ssh -p 8222 root@your-server.com \
  "docker exec computing-marketplace-backend npx tsx scripts/seed.ts && \
   docker exec computing-marketplace-backend npx tsx scripts/seed-extra.ts"
```

## 验证数据

### 检查数据库记录

```bash
# 本地或SSH到服务器后执行
docker exec computing-marketplace-backend npx prisma db execute --stdin <<'SQL'
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
ORDER BY table_name;
SQL
```

### 通过API验证

```bash
# 测试产品API
curl http://localhost:9211/api/products

# 测试分类API
curl http://localhost:9211/api/categories

# 测试解决方案API
curl http://localhost:9211/api/solutions
```

### 使用Adminer查看

访问: http://your-server:8081

- **服务器**: postgres
- **用户**: admin
- **密码**: password
- **数据库**: computing_marketplace

## 默认账号

初始化后会创建以下测试账号：

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@computing-marketplace.com | Admin@123 |
| 客户 | customer@example.com | Customer@123 |

## Seed数据说明

### 基础Seed (`scripts/seed.ts`)

- 产品分类 (Categories)
- GPU产品 (Products)
- 产品特性 (Features)
- 产品规格 (Specifications)
- 产品定价 (Pricing)
- 解决方案 (Solutions)

### 额外Seed (`scripts/seed-extra.ts`)

- 用户账号 (Users)
- 示例询价 (Inquiries)
- 示例订单 (Orders)
- 新闻文章 (News Articles)
- 导航菜单 (Navigation Items)

## 故障排查

### 问题1: 容器未运行

```bash
# 检查容器状态
docker ps | grep computing-marketplace

# 启动服务
cd frontend && docker-compose up -d
```

### 问题2: Seed失败

```bash
# 查看详细日志
docker logs computing-marketplace-backend -f

# 进入容器手动执行
docker exec -it computing-marketplace-backend sh
npx tsx scripts/seed.ts
```

### 问题3: 数据库表不存在

```bash
# 重新创建schema
docker exec computing-marketplace-backend npx prisma db push
```

### 问题4: 数据已存在

如果想重新初始化数据，需要先清空数据库：

```bash
# ⚠️ 警告: 这会删除所有数据
docker exec computing-marketplace-backend npx prisma db execute --stdin <<'SQL'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
SQL

# 重新创建schema并seed
docker restart computing-marketplace-backend
```

## 更多信息

- [CLAUDE.md](CLAUDE.md) - 项目架构和开发指南
- [QUICKSTART.md](QUICKSTART.md) - 快速启动指南
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署文档
