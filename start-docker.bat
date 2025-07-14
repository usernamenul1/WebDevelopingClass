@echo off
echo 启动体育活动平台 Docker 容器...
docker-compose up -d
echo.
echo 服务已启动:
echo - 前端: http://localhost (或 http://127.0.0.1)
echo - 后端 API: http://localhost:8000
echo - API文档: http://localhost:8000/docs
echo.
echo 使用 Ctrl+C 停止查看日志
echo 使用命令 docker-compose down 停止所有服务
echo.
docker-compose logs -f