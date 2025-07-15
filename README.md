# 体育活动平台

一个完整的在线体育活动平台，支持活动发布、报名、管理和评论等功能。

## 项目概述

这是一个前后端分离的体育活动平台，提供以下核心功能：

- 🔐 **用户认证**: 注册、登录、权限管理
- 📅 **活动管理**: 创建、编辑、删除、查看活动
- 🔍 **搜索功能**: 按关键词、时间、地点搜索活动
- 📝 **报名系统**: 活动报名、订单管理
- 💬 **评论功能**: 活动评论、互动交流
- 📱 **响应式设计**: 支持手机、平板、桌面端

## 技术架构

### 后端 (Backend)
- **框架**: FastAPI (Python)
- **数据库**: SQLAlchemy + SQLite
- **认证**: JWT (JSON Web Tokens)
- **API 文档**: 自动生成 Swagger/OpenAPI 文档

### 前端 (Frontend)
- **框架**: React 18
- **UI 库**: Ant Design 5
- **路由**: React Router 6
- **状态管理**: React Context
- **HTTP 客户端**: Axios

## 项目结构

```
WebDevelopingClass/
├── backend/                 # 后端 FastAPI 项目
│   ├── app/
│   │   ├── routers/        # API 路由
│   │   ├── models.py       # 数据模型
│   │   ├── schemas.py      # Pydantic 模式
│   │   ├── crud.py         # 数据库操作
│   │   ├── auth.py         # 认证逻辑
│   │   ├── database.py     # 数据库配置
│   │   └── main.py         # 主应用
│   ├── requirements.txt    # Python 依赖
│   └── README.md          # 后端文档
├── frontend/               # 前端 React 项目
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── contexts/      # React Context
│   │   ├── api/           # API 接口
│   │   └── App.js         # 主应用
│   ├── package.json       # Node.js 依赖
│   └── README.md          # 前端文档
└── README.md              # 项目总文档
```

## 快速开始

### 1. 环境要求

- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 2. 后端设置

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
python run.py
```

后端服务器将在 http://localhost:8000 启动

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端应用将在 http://localhost:3000 启动

### 4. 访问应用

- 前端应用: http://localhost:3000
- 后端 API 文档: http://localhost:8000/docs
- 后端 ReDoc 文档: http://localhost:8000/redoc

## API 接口文档

### 认证接口
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户信息

### 活动接口
- `GET /events/` - 获取活动列表（支持搜索分页）
- `POST /events/` - 创建活动
- `GET /events/{id}` - 获取活动详情
- `PUT /events/{id}` - 更新活动
- `DELETE /events/{id}` - 删除活动
- `POST /events/{id}/register` - 报名活动

### 订单接口
- `GET /orders/` - 获取我的订单
- `GET /orders/{id}` - 获取订单详情
- `DELETE /orders/{id}` - 取消订单

### 评论接口
- `POST /comments/` - 创建评论
- `GET /comments/events/{event_id}` - 获取活动评论
- `DELETE /comments/{id}` - 删除评论

## 数据模型

### 用户 (User)
- 用户名、邮箱、密码
- 真实姓名、手机号
- 创建时间、激活状态

### 活动 (Event)
- 标题、描述、地点
- 活动时间、容量、价格
- 状态、创建者信息

### 订单 (Order)
- 用户ID、活动ID
- 订单状态、创建时间

### 评论 (Comment)
- 评论内容、用户ID
- 活动ID、创建时间

## 功能特色

### 🔍 强大的搜索功能
- 关键词搜索（标题、描述）
- 时间范围过滤
- 地点筛选
- 状态筛选

### 📱 完全响应式
- 适配手机、平板、桌面
- 移动端优化的用户界面
- 触控友好的交互设计

### 🔐 安全的认证系统
- JWT 令牌认证
- 密码加密存储
- 自动令牌续期
- 权限控制

### 💡 用户友好的界面
- 现代化的 UI 设计
- 直观的操作流程
- 实时反馈和提示
- 优雅的错误处理

## 部署说明

### 后端部署
1. 设置生产环境变量
2. 配置数据库连接
3. 使用 gunicorn 或 uvicorn 部署
4. 配置反向代理（nginx）

### 前端部署
1. 构建生产版本: `npm run build`
2. 部署到静态文件服务器
3. 配置路由重定向
4. 设置 API 基础 URL

## 开发指南

### 添加新功能
1. 后端：添加路由、模型、CRUD 操作
2. 前端：添加页面、组件、API 调用
3. 测试功能完整性
4. 更新文档

### 代码规范
- 遵循 PEP 8 (Python) 和 React 最佳实践
- 使用有意义的变量和函数名
- 添加必要的注释和文档
- 进行代码审查

## 贡献指南

1. Fork 本项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。
