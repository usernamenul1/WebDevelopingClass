from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, events, orders, comments
from .database import engine
from . import models

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="体育活动平台 API",
    description="一个在线体育活动平台，支持活动发布、报名、评论等功能",
    version="1.0.0"
)

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(orders.router)
app.include_router(comments.router)

@app.get("/")
def read_root():
    return {"message": "欢迎使用体育活动平台 API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
