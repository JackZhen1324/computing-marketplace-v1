#!/bin/bash

# 完整部署脚本：构建 -> 测试 -> 启动
# Usage: ./deploy.sh [prod|dev]

ENV=${1:-prod}

echo "🚀 算力超市前端 - 一键部署"
echo "================================"
echo ""

# 检查Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

if [ "$ENV" = "dev" ]; then
    echo "🔧 部署开发环境..."
    COMPOSE_FILE="docker-compose.dev.yml"
    PORT="5173"
else
    echo "🚀 部署生产环境..."
    COMPOSE_FILE="docker-compose.yml"
    PORT="3000"
fi

# 停止旧容器
echo "1️⃣  停止旧容器..."
docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true

# 清理旧构建（可选）
echo "2️⃣  清理旧构建..."
docker builder prune -f 2>/dev/null || true

# 构建新镜像
echo "3️⃣  构建新镜像..."
docker-compose -f "$COMPOSE_FILE" build --no-cache

# 启动容器
echo "4️⃣  启动容器..."
docker-compose -f "$COMPOSE_FILE" up -d

# 健康检查
echo "5️⃣  健康检查..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s "http://localhost:$PORT/health" > /dev/null 2>&1; then
        echo "✅ 健康检查通过"
        break
    fi

    ATTEMPT=$((ATTEMPT + 1))
    echo "   等待服务启动... ($ATTEMPT/$MAX_ATTEMPTS)"
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ 健康检查失败"
    echo ""
    echo "📋 查看日志:"
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    exit 1
fi

# 显示状态
echo ""
echo "✅ 部署成功！"
echo ""
echo "📊 容器状态:"
docker-compose -f "$COMPOSE_FILE" ps
echo ""
echo "🌐 访问地址: http://localhost:$PORT"
echo "📝 查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 停止服务: ./stop-$ENV.sh"
echo ""
