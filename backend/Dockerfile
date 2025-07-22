# 使用Python官方镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制所有源代码
COPY . .

# 如果没有.env文件，复制示例文件
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# 初始化数据库
RUN python init_db.py

# 暴露端口
EXPOSE 8000

# 启动应用
CMD ["python", "run.py"]