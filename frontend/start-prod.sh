#!/bin/bash

# 一键启动生产环境
# Usage: ./start-prod.sh

set -e

echo "🚀 启动算力超市前端 - 生产环境"
echo "================================"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 停止旧容器（如果存在）
echo "🛑 停止旧容器..."
docker-compose down 2>/dev/null || true

# 构建并启动
echo "🔨 构建镜像..."
docker-compose build

echo "▶️  启动容器..."
docker-compose up -d

# 等待健康检查
echo "⏳ 等待服务启动..."
sleep 5

# 显示状态
echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 容器状态:"
docker-compose ps
echo ""
echo "🌐 访问地址: http://localhost:3000"
echo ""
echo "📝 查看日志: docker-compose logs -f"
echo "🛑 停止服务: ./stop-prod.sh"
echo ""
