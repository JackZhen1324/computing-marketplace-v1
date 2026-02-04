#!/bin/bash

# 重启生产环境
# Usage: ./restart-prod.sh

set -e

echo "🔄 重启算力超市前端 - 生产环境"
echo "================================"

docker-compose restart

echo "⏳ 等待服务启动..."
sleep 3

echo ""
echo "✅ 重启完成"
echo ""
echo "📊 容器状态:"
docker-compose ps
echo ""
echo "🌐 访问地址: http://localhost:3000"
echo ""
