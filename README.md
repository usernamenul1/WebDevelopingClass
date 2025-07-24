# 前后端代码库地址

https://github.com/usernamenul1/WebDevelopingClass

# 启动说明

+ Windows: start.bat
+ Linux: start.sh (未经验证的)

## 使用Docker-compose部署

1. **构建和运行容器**：

   ```bash
   docker-compose up -d
   ```

2. **查看服务状态**：

   ```bash
   docker-compose ps
   ```

3. **查看日志**：

   ```bash
   docker-compose logs -f
   ```

4. **停止服务**：

   ```bash
   docker-compose down
   ```

通过这种设置，前端将在80端口可访问，后端API在8000端口运行。

如果后端有特殊的环境变量需求，可以在`docker-compose.yml`的`environment`部分进一步配置。

# 额外实现的功能描述

1. 使用nginx解决跨域问题，接近生产环境
2. 使用docker-compose容器化部署
3. 响应式API: 支持多种设备，移动端优化
4. 更强大的搜索功能：按地点、时间范围等
5. 前后端文档：
   + 后端 API 文档: http://localhost:8000/docs
   + 后端 ReDoc 文档: http://localhost:8000/redoc

# 印象深刻的内容

使用Github Actions进行 CI/CD 与代码质量审查。
