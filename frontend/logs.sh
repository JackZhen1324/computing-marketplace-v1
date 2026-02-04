#!/bin/bash

# 查看日志
# Usage: ./logs.sh [prod|dev]

ENV=${1:-prod}

if [ "$ENV" = "dev" ]; then
    echo "📋 查看开发环境日志 (Ctrl+C 退出)"
    echo "=================================="
    docker-compose -f docker-compose.dev.yml logs -f
else
    echo "📋 查看生产环境日志 (Ctrl+C 退出)"
    echo "=================================="
    docker-compose logs -f
fi
