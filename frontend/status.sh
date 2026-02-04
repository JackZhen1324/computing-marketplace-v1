#!/bin/bash

# 查看容器状态
# Usage: ./status.sh

echo "📊 算力超市前端 - 容器状态"
echo "================================"
echo ""

echo "🔷 生产环境:"
docker-compose ps 2>/dev/null || echo "  未运行"
echo ""

echo "🔶 开发环境:"
docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "  未运行"
echo ""

echo "🖥️  Docker镜像:"
docker images computing-marketplace* --format "  {{.Repository}}:{{.Tag}} - {{.Size}} - {{.CreatedAt}}" 2>/dev/null || echo "  未找到镜像"
echo ""

echo "💾 磁盘使用:"
docker system df --format "  {{.Type}}: {{.Count}} items, {{.Usage}}" 2>/dev/null || echo "  无法获取"
echo ""
