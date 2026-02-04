@echo off
REM 停止生产环境 (Windows)

echo ================================================
echo   停止算力超市前端 - 生产环境
echo ================================================
echo.

docker-compose down

echo.
echo [成功] 生产环境已停止
echo.
echo   提示:
echo     重新启动: start.bat
echo     完全清理: cleanup.bat
echo.
pause
