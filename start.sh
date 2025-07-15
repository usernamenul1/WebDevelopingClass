#!/bin/bash

echo "正在启动体育活动平台..."
echo

echo "[1/3] 初始化后端数据库..."
cd backend
python init_db.py
echo

echo "[2/3] 启动后端服务..."
python run.py &
BACKEND_PID=$!
echo "后端服务已启动 (PID: $BACKEND_PID)"
sleep 5

echo "[3/3] 启动前端服务..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "前端服务已启动 (PID: $FRONTEND_PID)"

echo
echo "========================================"
echo "体育活动平台启动完成！"
echo
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:8000"
echo "API 文档: http://localhost:8000/docs"
echo "数据库: SQLite (sports_platform.db)"
echo "========================================"
echo
echo "提示："
echo "- 默认管理员账号: admin / admin123"
echo "- 测试用户账号: user1 / user123"
echo
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait
