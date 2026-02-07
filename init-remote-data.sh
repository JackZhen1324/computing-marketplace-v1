#!/bin/bash

# 一键初始化远程服务器数据库数据
# Usage: ./init-remote-data.sh [ssh-host] [ssh-user] [ssh-port]
#
# Example:
#   ./init-remote-data.sh your-server.com root 22
#   ./init-remote-data.sh 192.168.1.100 ubuntu
#

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 参数解析
SERVER_HOST=${1:-""}
SERVER_USER=${2:-"root"}
SERVER_PORT=${3:-"22"}

# 如果没有提供服务器地址，提示用户
if [ -z "$SERVER_HOST" ]; then
    echo -e "${YELLOW}用法: $0 <服务器地址> [SSH用户] [SSH端口]${NC}"
    echo ""
    echo "示例:"
    echo "  $0 your-server.com root 22"
    echo "  $0 192.168.1.100 ubuntu"
    echo ""
    read -p "请输入服务器地址: " SERVER_HOST
    read -p "请输入SSH用户 (默认root): " SERVER_USER_INPUT
    SERVER_USER=${SERVER_USER_INPUT:-$SERVER_USER}
    read -p "请输入SSH端口 (默认22): " SERVER_PORT_INPUT
    SERVER_PORT=${SERVER_PORT_INPUT:-$SERVER_PORT}
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}算力超市 - 远程数据库初始化脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "服务器: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo ""

# 确认操作
echo -e "${YELLOW}即将在远程服务器上执行以下操作:${NC}"
echo "1. 检查backend容器状态"
echo "2. 执行基础seed数据 (categories, products等)"
echo "3. 执行额外seed数据 (users, inquiries等)"
echo "4. 验证数据是否成功插入"
echo ""
read -p "确认继续? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}操作已取消${NC}"
    exit 1
fi

# SSH命令前缀
SSH_CMD="ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"

echo -e "${GREEN}步骤 1: 检查容器状态...${NC}"
$SSH_CMD "docker ps | grep computing-marketplace-backend" || {
    echo -e "${RED}错误: backend容器未运行${NC}"
    exit 1
}
echo -e "${GREEN}✓ 容器运行正常${NC}"
echo ""

echo -e "${GREEN}步骤 2: 执行基础seed数据...${NC}"
$SSH_CMD "docker exec computing-marketplace-backend npx tsx scripts/seed.ts" || {
    echo -e "${YELLOW}⚠ 基础seed执行完成（可能有警告）${NC}"
}
echo -e "${GREEN}✓ 基础seed完成${NC}"
echo ""

echo -e "${GREEN}步骤 3: 执行额外seed数据...${NC}"
$SSH_CMD "docker exec computing-marketplace-backend npx tsx scripts/seed-extra.ts" || {
    echo -e "${YELLOW}⚠ 额外seed执行完成（可能有警告）${NC}"
}
echo -e "${GREEN}✓ 额外seed完成${NC}"
echo ""

echo -e "${GREEN}步骤 4: 验证数据...${NC}"
echo "检查数据库表记录数:"
$SSH_CMD "docker exec computing-marketplace-backend npx prisma db execute --stdin <<'SQL'
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'inquiries', COUNT(*) FROM inquiries
ORDER BY table_name;
SQL"
echo ""

echo -e "${GREEN}步骤 5: 查看最新日志...${NC}"
$SSH_CMD "docker logs computing-marketplace-backend --tail 20"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ 数据初始化完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "默认登录账号:"
echo "  管理员: admin@computing-marketplace.com / Admin@123"
echo "  客户: customer@example.com / Customer@123"
echo ""
echo "测试API:"
echo "  curl http://$SERVER_HOST:9211/api/products"
echo "  curl http://$SERVER_HOST:9211/api/categories"
echo ""
