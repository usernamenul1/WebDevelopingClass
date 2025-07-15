@echo off
echo 正在启动体育活动平台...
echo.

echo [1/4] 检查 Python 环境...
python --version
if %errorlevel% neq 0 (
    echo 错误：未找到 Python，请确保已安装 Python 3.8 或更高版本
    pause
    exit /b 1
)
echo.

echo [2/4] 安装/更新依赖包...
cd backend
pip install --upgrade -r requirements.txt
if %errorlevel% neq 0 (
    echo 错误：依赖包安装失败
    pause
    exit /b 1
)
echo.

echo [3/4] 初始化数据库...
python init_db.py
if %errorlevel% neq 0 (
    echo 警告：数据库初始化出现问题，但将继续启动...
)
echo.

echo [4/4] 启动服务...
echo 启动后端服务...
start "Backend Server - 体育活动平台" cmd /k "python run.py"
echo 后端服务正在启动，请等待...
timeout /t 5

echo 启动前端服务...
cd ..\frontend
start "Frontend Server - 体育活动平台" cmd /k "npm start"
echo 前端服务正在启动...

echo.
echo ========================================
echo 🎉 体育活动平台启动完成！
echo.
echo 📱 前端地址: http://localhost:3000
echo 🔧 后端地址: http://localhost:8000
echo 📚 API 文档: http://localhost:8000/docs
echo 💾 数据库: SQLite (sports_platform.db)
echo ========================================
echo.
echo 🔑 测试账号：
echo - 管理员账号: admin / admin123
echo - 测试用户账号: user1 / user123
echo.
echo 💡 提示：
echo - 关闭命令窗口可停止对应服务
echo - 数据库文件位于 backend/sports_platform.db
echo.
pause
