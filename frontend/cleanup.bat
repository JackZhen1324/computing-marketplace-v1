@echo off
REM 清理Docker资源 (Windows)

echo ================================================
echo   清理Docker资源
echo ================================================
echo.

echo [1/2] 停止所有容器...
docker-compose down 2>nul
docker-compose -f docker-compose.dev.yml down 2>nul

echo [2/2] 清理未使用的资源...
set /p confirm="是否执行docker system prune? (y/N): "
if /i "%confirm%"=="y" (
    docker system prune -f
    echo [成功] 清理完成
) else (
    echo [跳过] 未执行清理
)

echo.
pause
