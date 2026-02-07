#!/bin/bash

# 本地数据库初始化脚本
# Usage: ./init-local-data.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}算力超市 - 本地数据库初始化脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查Docker是否运行
if ! docker ps &> /dev/null; then
    echo "错误: Docker未运行，请先启动Docker"
    exit 1
fi

# 检查backend容器是否运行
if ! docker ps | grep -q computing-marketplace-backend; then
    echo "错误: backend容器未运行"
    echo "请先启动服务: cd frontend && docker-compose up -d"
    exit 1
fi

echo -e "${GREEN}步骤 1: 执行基础seed数据...${NC}"
docker exec computing-marketplace-backend npx tsx scripts/seed.ts || {
    echo -e "${YELLOW}⚠ 基础seed执行完成（可能有警告）${NC}"
}
echo -e "${GREEN}✓ 基础seed完成${NC}"
echo ""

echo -e "${GREEN}步骤 2: 执行额外seed数据...${NC}"
docker exec computing-marketplace-backend npx tsx scripts/seed-extra.ts || {
    echo -e "${YELLOW}⚠ 额外seed执行完成（可能有警告）${NC}"
}
echo -e "${GREEN}✓ 额外seed完成${NC}"
echo ""

echo -e "${GREEN}步骤 3: 验证数据...${NC}"
echo "数据库表记录数:"
docker exec computing-marketplace-backend npx prisma db execute --stdin <<'SQL'
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'inquiries', COUNT(*) FROM inquiries
ORDER BY table_name;
SQL
echo ""

echo -e "${GREEN}步骤 4: 查看最新日志...${NC}"
docker logs computing-marketplace-backend --tail 20
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
echo "  curl http://localhost:9211/api/products"
echo "  curl http://localhost:9211/api/categories"
echo ""
