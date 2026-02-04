#!/bin/bash

# 清理Docker资源
# Usage: ./cleanup.sh

echo "🧹 清理Docker资源"
echo "================================"
echo ""

# 停止所有容器
echo "🛑 停止所有容器..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# 删除镜像
echo "🗑️  删除镜像..."
read -p "是否删除Docker镜像? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi computing-marketplace:test 2>/dev/null || true
    echo "✅ 镜像已删除"
else
    echo "⏭️  跳过删除镜像"
fi

# 清理未使用的资源
echo ""
echo "🧼 清理未使用的Docker资源..."
read -p "是否执行docker system prune? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -f
    echo "✅ 清理完成"
else
    echo "⏭️  跳过系统清理"
fi

echo ""
echo "✅ 清理完成"
echo ""
