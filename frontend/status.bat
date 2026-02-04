@echo off
REM 查看容器状态 (Windows)

echo ================================================
echo   算力超市前端 - 容器状态
echo ================================================
echo.

echo [生产环境]
docker-compose ps
echo.

echo [开发环境]
docker-compose -f docker-compose.dev.yml ps 2>nul
echo.

echo [Docker镜像]
docker images computing-marketplace*
echo.

pause
