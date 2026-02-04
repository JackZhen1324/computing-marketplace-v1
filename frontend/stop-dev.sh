#!/bin/bash

# 停止开发环境
# Usage: ./stop-dev.sh

echo "🛑 停止算力超市前端 - 开发环境"
echo "================================"

docker-compose -f docker-compose.dev.yml down

echo "✅ 开发环境已停止"
echo ""
echo "💡 提示:"
echo "  - 重新启动: ./start-dev.sh"
echo "  - 完全清理: ./cleanup.sh"
echo ""
