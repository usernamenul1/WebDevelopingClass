# 构建阶段
FROM node:16-alpine as build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 创建.env文件（生产环境配置）
RUN echo "REACT_APP_API_URL=/api" > .env

# 构建应用
RUN npm run build

# 部署阶段
FROM nginx:alpine

# 复制构建结果到nginx目录
COPY --from=build /app/build /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]