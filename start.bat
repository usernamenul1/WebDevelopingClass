@echo off
echo 正在启动体育活动平台...
echo.

echo [1/2] 启动后端服务...
cd backend
start "Backend Server" cmd /k "python run.py"
echo 后端服务正在启动，请等待...
timeout /t 3

echo [2/2] 启动前端服务...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"
echo 前端服务正在启动...

echo.
echo ========================================
echo 体育活动平台启动完成！
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8000
echo API 文档: http://localhost:8000/docs
echo ========================================
echo.
pause
