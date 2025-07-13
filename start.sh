#!/bin/bash

echo "正在启动体育活动平台..."
echo

echo "[1/2] 启动后端服务..."
cd backend
python run.py &
BACKEND_PID=$!
echo "后端服务已启动 (PID: $BACKEND_PID)"
sleep 3

echo "[2/2] 启动前端服务..."
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
echo "========================================"
echo
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait
