"""
测试配置文件 - 修复数据库权限问题
"""
import pytest
import os
import sys
import tempfile
from fastapi.testclient import TestClient

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import get_db
from app.models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


@pytest.fixture
def test_db():
    """创建测试数据库 - 使用临时目录避免权限问题"""
    # 使用临时目录创建测试数据库
    temp_dir = tempfile.gettempdir()
    test_db_path = os.path.join(temp_dir, f"test_{os.getpid()}.db")
    
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{test_db_path}"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # 创建数据库表
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    # 重写数据库依赖
    app.dependency_overrides[get_db] = override_get_db
    
    yield engine
    
    # 清理
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    
    # 删除测试数据库文件
    if os.path.exists(test_db_path):
        try:
            os.remove(test_db_path)
        except:
            pass  # 忽略删除失败


@pytest.fixture
def client(test_db):
    """创建测试客户端"""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user_data():
    """测试用户数据"""
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }


@pytest.fixture  
def test_event_data():
    """测试活动数据"""
    from datetime import datetime, timedelta
    
    return {
        "title": "测试体育活动",
        "description": "这是一个测试活动",
        "location": "测试体育馆",
        "event_time": (datetime.now() + timedelta(days=7)).isoformat(),
        "capacity": 50,
        "price": 0  # 免费活动
    }


@pytest.fixture
def authenticated_user(client, test_user_data):
    """创建认证用户并返回认证头"""
    # 注册用户
    response = client.post("/auth/register", json=test_user_data)
    assert response.status_code in [200, 201]
    
    # 登录获取token
    login_data = {
        "username": test_user_data["username"],
        "password": test_user_data["password"]
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200
    
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
