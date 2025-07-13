# 体育活动平台部署指南

本文档详细说明如何在不同环境中部署体育活动平台。

## 🚀 快速开始（开发环境）

### 系统要求

- Python 3.8+
- Node.js 16+
- Git

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd WebDevelopingClass
```

### 2. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 初始化数据库（创建测试数据）
python init_db.py

# 启动后端服务
python run.py
```

后端将在 http://localhost:8000 启动

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动前端服务
npm start
```

前端将在 http://localhost:3000 启动

### 4. 快速启动脚本

Windows用户可以直接运行：
```bash
start.bat
```

macOS/Linux用户：
```bash
chmod +x start.sh
./start.sh
```

## 🔧 环境配置

### 后端环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
# 数据库配置
DATABASE_URL=sqlite:///./sports_platform.db
# 或使用 PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost/sports_platform

# JWT 配置
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 开发环境
DEBUG=True
```

### 前端环境变量

在 `frontend` 目录下创建 `.env` 文件：

```env
REACT_APP_API_URL=http://localhost:8000
```

## 🐳 Docker 部署

### 1. 后端 Dockerfile

在 `backend` 目录创建 `Dockerfile`：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. 前端 Dockerfile

在 `frontend` 目录创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: sports_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres/sports_platform
      SECRET_KEY: your-production-secret-key
    depends_on:
      - postgres
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    environment:
      REACT_APP_API_URL: http://localhost:8000
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

启动服务：
```bash
docker-compose up -d
```

## 🌐 生产环境部署

### 1. 后端生产部署

#### 使用 Gunicorn + Nginx

```bash
# 安装 gunicorn
pip install gunicorn

# 启动应用
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. 前端生产部署

```bash
# 构建生产版本
npm run build

# 部署到静态文件服务器
# 可以使用 nginx, apache, 或云服务
```

#### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-server;
    }
}
```

## 📊 数据库迁移

### SQLite (开发环境)

SQLite 数据库会自动创建，无需额外配置。

### PostgreSQL (生产环境)

```bash
# 安装 PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE sports_platform;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sports_platform TO your_user;
\q

# 更新环境变量
DATABASE_URL=postgresql://your_user:your_password@localhost/sports_platform
```

### 数据库初始化

```bash
# 运行初始化脚本
python init_db.py
```

## 🔒 安全配置

### 1. JWT 密钥

生成强密钥：
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. CORS 配置

在生产环境中，更新 `backend/app/main.py` 中的 CORS 设置：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # 只允许你的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. HTTPS 配置

使用 Let's Encrypt 配置 SSL：

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

## 🔍 监控和日志

### 1. 应用监控

推荐使用：
- **Sentry**: 错误追踪
- **Prometheus + Grafana**: 性能监控
- **PM2**: 进程管理（Node.js应用）

### 2. 日志配置

在 `backend/app/main.py` 中添加日志配置：

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

## 🚀 性能优化

### 1. 后端优化

- 使用连接池
- 添加缓存 (Redis)
- 数据库索引优化
- API 限流

### 2. 前端优化

- 代码分割
- 图片优化
- CDN 加速
- 浏览器缓存

## 🧪 测试

### 后端测试

```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest
```

### 前端测试

```bash
cd frontend
npm test
```

## 🔄 CI/CD

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: 16
    
    - name: Deploy Backend
      run: |
        cd backend
        pip install -r requirements.txt
        # 添加部署脚本
    
    - name: Deploy Frontend
      run: |
        cd frontend
        npm install
        npm run build
        # 添加部署脚本
```

## 📞 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 查看端口占用
   netstat -tlnp | grep :8000
   # 杀死进程
   kill -9 <PID>
   ```

2. **数据库连接失败**
   - 检查数据库服务是否启动
   - 验证连接字符串
   - 检查防火墙设置

3. **CORS 错误**
   - 确认前端域名在后端 CORS 设置中
   - 检查请求头设置

4. **JWT 认证失败**
   - 验证密钥设置
   - 检查令牌过期时间
   - 确认请求头格式

### 日志查看

```bash
# 后端日志
tail -f backend/app.log

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 📝 维护

### 定期维护任务

- 数据库备份
- 日志清理
- 依赖更新
- 安全补丁

### 备份策略

```bash
# 数据库备份
pg_dump sports_platform > backup_$(date +%Y%m%d).sql

# 文件备份
tar -czf app_backup_$(date +%Y%m%d).tar.gz /path/to/app
```

---

如有问题，请查看日志或联系开发团队。
