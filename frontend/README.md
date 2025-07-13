# 体育活动平台前端

这是一个基于 React + Ant Design 开发的体育活动平台前端应用。

## 功能特性

- ✅ 用户注册与登录
- ✅ 活动列表展示与搜索
- ✅ 活动详情查看
- ✅ 活动创建与管理
- ✅ 活动报名功能
- ✅ 订单管理
- ✅ 活动评论系统
- ✅ 个人资料管理
- ✅ 响应式设计

## 技术栈

- **框架**: React 18
- **UI 库**: Ant Design 5
- **路由**: React Router 6
- **HTTP 客户端**: Axios
- **日期处理**: Day.js
- **构建工具**: Create React App

## 项目结构

```
src/
├── api/                 # API 接口
│   └── index.js        # 统一的 API 配置
├── components/         # 通用组件
│   ├── Navbar.js      # 导航栏
│   └── ProtectedRoute.js # 路由保护组件
├── contexts/          # React Context
│   └── AuthContext.js # 认证上下文
├── pages/             # 页面组件
│   ├── Home.js        # 首页
│   ├── Login.js       # 登录页
│   ├── Register.js    # 注册页
│   ├── EventList.js   # 活动列表
│   ├── EventDetail.js # 活动详情
│   ├── CreateEvent.js # 创建活动
│   ├── MyEvents.js    # 我的活动
│   ├── MyOrders.js    # 我的订单
│   └── Profile.js     # 个人资料
├── App.js             # 主应用组件
├── index.js           # 入口文件
└── index.css          # 全局样式
```

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 打开浏览器访问：http://localhost:3000

## 主要页面

### 首页 (/)
- 展示平台介绍
- 统计数据展示
- 功能特色介绍

### 活动列表 (/events)
- 显示所有活动
- 支持搜索和筛选
- 分页展示
- 活动卡片展示

### 活动详情 (/events/:id)
- 活动详细信息
- 报名功能
- 评论系统
- 实时更新报名人数

### 用户管理
- 注册/登录 (/register, /login)
- 个人资料 (/profile)
- 我的活动 (/my-events)
- 我的订单 (/my-orders)

### 活动管理
- 创建活动 (/create-event)
- 编辑活动
- 删除活动

## API 集成

所有 API 调用都通过 `src/api/index.js` 统一管理：

- **认证 API**: 注册、登录、获取用户信息
- **活动 API**: CRUD 操作、搜索、报名
- **订单 API**: 查看、取消订单
- **评论 API**: 创建、查看、删除评论

## 状态管理

使用 React Context 进行状态管理：

- **AuthContext**: 用户认证状态
- 自动处理 JWT token
- 提供登录/登出功能
- 路由保护

## 响应式设计

- 使用 Ant Design 的栅格系统
- 适配移动端和桌面端
- 优化移动端用户体验

## 环境变量

可以通过环境变量配置：

```env
REACT_APP_API_URL=http://localhost:8000
```

## 构建部署

```bash
# 构建生产版本
npm run build

# 构建后的文件在 build/ 目录
```

## 开发规范

- 使用函数组件和 Hooks
- 遵循 React 最佳实践
- 统一的代码风格
- 合理的组件拆分
- 错误处理和用户反馈
