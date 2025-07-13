# 体育活动平台后端 API

这是一个基于 FastAPI 开发的体育活动平台后端服务，提供完整的 RESTful API 接口。

## 功能特性

- ✅ 用户注册与登录（JWT 认证）
- ✅ 活动管理（创建、编辑、删除、查看）
- ✅ 活动搜索与分页
- ✅ 活动报名与订单管理
- ✅ 活动评论系统
- ✅ 用户权限控制

## 技术栈

- **Web 框架**: FastAPI
- **数据库**: SQLAlchemy + SQLite/PostgreSQL
- **认证**: JWT (JSON Web Tokens)
- **密码加密**: bcrypt
- **数据验证**: Pydantic

## API 接口文档

### 🔐 认证接口

| 方法 | 路径             | 描述             | 认证要求 |
| ---- | ---------------- | ---------------- | -------- |
| POST | `/auth/register` | 用户注册         | ❌        |
| POST | `/auth/login`    | 用户登录         | ❌        |
| GET  | `/auth/me`       | 获取当前用户信息 | ✅        |

### 📅 活动接口

| 方法   | 路径                          | 描述                         | 认证要求     |
| ------ | ----------------------------- | ---------------------------- | ------------ |
| POST   | `/events/`                    | 创建活动                     | ✅            |
| GET    | `/events/`                    | 获取活动列表（支持搜索分页） | ❌            |
| GET    | `/events/my`                  | 获取我创建的活动             | ✅            |
| GET    | `/events/{event_id}`          | 获取活动详情                 | ❌            |
| PUT    | `/events/{event_id}`          | 更新活动                     | ✅ (仅创建者) |
| DELETE | `/events/{event_id}`          | 删除活动                     | ✅ (仅创建者) |
| POST   | `/events/{event_id}/register` | 报名活动                     | ✅            |

### 📋 订单接口

| 方法   | 路径                 | 描述             | 认证要求         |
| ------ | -------------------- | ---------------- | ---------------- |
| GET    | `/orders/`           | 获取我的订单列表 | ✅                |
| GET    | `/orders/{order_id}` | 获取订单详情     | ✅ (仅订单所有者) |
| DELETE | `/orders/{order_id}` | 取消订单         | ✅ (仅订单所有者) |

### 💬 评论接口

| 方法   | 路径                          | 描述         | 认证要求       |
| ------ | ----------------------------- | ------------ | -------------- |
| POST   | `/comments/`                  | 创建评论     | ✅              |
| GET    | `/comments/events/{event_id}` | 获取活动评论 | ❌              |
| DELETE | `/comments/{comment_id}`      | 删除评论     | ✅ (仅评论作者) |

## 数据模型

### 用户 (User)
- id: 用户ID
- username: 用户名
- email: 邮箱
- full_name: 全名
- phone: 电话
- is_active: 是否激活
- created_at: 创建时间

### 活动 (Event)
- id: 活动ID
- title: 活动标题
- description: 活动描述
- location: 活动地点
- event_time: 活动时间
- capacity: 活动容量
- price: 活动价格（分）
- status: 活动状态（active/cancelled/completed）
- creator_id: 创建者ID

### 订单 (Order)
- id: 订单ID
- user_id: 用户ID
- event_id: 活动ID
- status: 订单状态（active/cancelled）
- created_at: 创建时间

### 评论 (Comment)
- id: 评论ID
- content: 评论内容
- user_id: 用户ID
- event_id: 活动ID
- created_at: 创建时间

## 快速开始

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 设置环境变量（复制 .env.example 为 .env 并修改配置）

3. 启动服务：
```bash
python run.py
```

4. 访问 API 文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 搜索功能

活动列表接口支持以下搜索参数：
- `search`: 关键词搜索（标题和描述）
- `date_from`: 开始日期过滤
- `date_to`: 结束日期过滤
- `location`: 地点过滤
- `status`: 状态过滤
- `page`: 页码
- `limit`: 每页数量

示例：
```
GET /events/?search=篮球&location=北京&page=1&limit=10
```

## 权限设计

- 公开接口：活动列表、活动详情、活动评论查看
- 需要登录：活动创建、报名、评论、订单管理
- 资源所有者权限：只有创建者可以编辑/删除自己的活动和评论
