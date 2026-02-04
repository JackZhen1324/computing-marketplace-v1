@echo off
REM 一键启动生产环境 (Windows)
REM Usage: start.bat

echo ================================================
echo   启动算力超市前端 - 生产环境
echo ================================================
echo.

REM 检查Docker
docker info >nul 2>&1
if errorlevel 1 (
    echo [错误] Docker未运行，请先启动Docker Desktop
    pause
    exit /b 1
)

REM 停止旧容器
echo [1/3] 停止旧容器...
docker-compose down 2>nul

REM 构建并启动
echo [2/3] 构建镜像...
docker-compose build

echo [3/3] 启动容器...
docker-compose up -d

REM 等待启动
echo.
echo [INFO] 等待服务启动...
timeout /t 5 /nobreak >nul

REM 显示状态
echo.
echo ================================================
echo   部署完成！
echo ================================================
echo.
echo   访问地址: http://localhost:3000
echo   查看日志: docker-compose logs -f
echo   停止服务: stop.bat
echo.
pause
