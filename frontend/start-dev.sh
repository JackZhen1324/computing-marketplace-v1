#!/bin/bash

# 一键启动开发环境（支持热重载）
# Usage: ./start-dev.sh

set -e

echo "🔧 启动算力超市前端 - 开发环境"
echo "================================"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 停止旧容器（如果存在）
echo "🛑 停止旧容器..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# 构建并启动
echo "🔨 构建开发镜像..."
docker-compose -f docker-compose.dev.yml build

echo "▶️  启动开发容器..."
docker-compose -f docker-compose.dev.yml up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 3

# 显示状态
echo ""
echo "✅ 开发环境启动完成！"
echo ""
echo "📊 容器状态:"
docker-compose -f docker-compose.dev.yml ps
echo ""
echo "🌐 访问地址: http://localhost:5173"
echo "🔥 热重载已启用，修改代码会自动刷新"
echo ""
echo "📝 查看日志: docker-compose -f docker-compose.dev.yml logs -f"
echo "🛑 停止服务: ./stop-dev.sh"
echo ""
