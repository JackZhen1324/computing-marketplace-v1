#!/bin/bash

# 停止生产环境
# Usage: ./stop-prod.sh

echo "🛑 停止算力超市前端 - 生产环境"
echo "================================"

docker-compose down

echo "✅ 生产环境已停止"
echo ""
echo "💡 提示:"
echo "  - 重新启动: ./start-prod.sh"
echo "  - 完全清理: ./cleanup.sh"
echo ""
