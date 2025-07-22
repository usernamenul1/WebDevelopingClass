# GitHub Actions CI/CD 配置说明

本项目已配置了完整的 CI/CD 流水线，包括持续集成、代码质量检查、自动化测试和部署流程。

## 📁 工作流文件

### 1. `ci.yml` - 主要的持续集成流水线
**触发条件：** 
- 推送到 `main` 或 `develop` 分支
- 对 `main` 分支的拉取请求

**包含的作业：**
- ✅ **前端测试和构建** - Node.js 环境下的测试和构建
- ✅ **后端测试和构建** - Python 环境下的测试和构建
- ✅ **Docker 构建和测试** - 容器化构建和集成测试
- ✅ **安全扫描** - 漏洞扫描和安全检查
- ✅ **部署准备** - 创建部署包（仅主分支）

### 2. `code-quality.yml` - 代码质量检查
**触发条件：** 
- 推送到 `main` 或 `develop` 分支
- 对 `main` 分支的拉取请求

**包含的作业：**
- 🔍 **代码格式检查** - Black、isort 格式化检查
- 🔍 **代码规范检查** - flake8 代码风格检查
- 🔍 **安全扫描** - Bandit 安全漏洞检查
- 🔍 **依赖检查** - Safety 依赖安全检查
- 🔍 **性能测试** - Lighthouse 前端性能测试

### 3. `deploy.yml` - 部署流水线
**触发条件：** 
- 推送到 `main` 分支（自动部署到暂存环境）
- 手动触发（可选择暂存或生产环境）

**包含的作业：**
- 🐳 **构建和推送镜像** - 构建 Docker 镜像并推送到 GitHub Container Registry
- 🚀 **部署到暂存环境** - 自动部署到暂存环境
- 🚀 **部署到生产环境** - 手动触发的生产部署
- 💚 **健康检查** - 部署后的服务健康检查
- 📢 **部署通知** - 部署结果通知

## 🧪 测试配置

### 后端测试
- **位置：** `backend/tests/`
- **框架：** pytest
- **覆盖率：** pytest-cov
- **测试类型：**
  - API 端点测试
  - 业务逻辑测试
  - 数据库操作测试
  - 认证和安全测试

### 前端测试
- **位置：** `frontend/src/__tests__/`
- **框架：** Jest + React Testing Library
- **测试类型：**
  - 组件渲染测试
  - 用户交互测试
  - 路由测试
  - API 集成测试

## 🔧 使用指南

### 本地开发
```bash
# 安装依赖并运行测试
cd backend && pip install -r requirements.txt && pytest
cd frontend && npm install && npm test
```

### 触发构建
1. **自动触发：** 推送代码到 `main` 或 `develop` 分支
2. **手动触发：** 在 GitHub Actions 页面手动运行工作流

### 部署流程
1. **自动部署：** 推送到 `main` 分支会自动部署到暂存环境
2. **生产部署：** 在 Actions 页面选择"Deploy to Production"手动触发

### 查看结果
- **CI 状态：** 在 Pull Request 页面查看检查状态
- **测试报告：** 在 Actions 页面查看详细的测试结果
- **代码覆盖率：** 在 Codecov 仪表板查看覆盖率报告
- **安全报告：** 在 Security 页面查看安全扫描结果

## 🔐 必需的 Secrets

在 GitHub 仓库设置中配置以下 Secrets：

```bash
# 可选：部署相关
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key

# 可选：通知相关
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK_URL=your_discord_webhook
```

## 📊 质量标准

### 测试覆盖率目标
- 后端：≥ 80%
- 前端：≥ 70%

### 代码质量标准
- Python：符合 PEP 8 标准
- JavaScript：通过 ESLint 检查
- 安全：无高危安全漏洞

### 性能标准
- Lighthouse 性能得分：≥ 80
- API 响应时间：≤ 500ms

## 🚨 故障排除

### 常见问题
1. **测试失败：** 检查测试日志，确保依赖正确安装
2. **构建失败：** 验证 Dockerfile 配置和依赖版本
3. **部署失败：** 检查环境变量和网络连接
4. **安全扫描警告：** 更新依赖版本或添加例外规则

### 调试建议
1. 在本地运行相同的命令来复现问题
2. 检查 GitHub Actions 日志的详细输出
3. 验证所有必需的 secrets 都已正确配置
4. 确保分支保护规则不会阻止必要的操作

## 🔄 持续改进

定期审查和更新：
- 依赖版本
- 测试用例
- 安全配置
- 性能基准
- 部署策略
