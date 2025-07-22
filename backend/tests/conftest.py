import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.auth import get_password_hash
from app import models

# 使用内存数据库进行测试
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    """每个测试函数都会使用一个新的数据库会话"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    """创建测试客户端，使用测试数据库会话"""
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db):
    """创建测试用户"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": get_password_hash("testpassword"),
        "full_name": "Test User",
        "phone": "1234567890"
    }
    user = models.User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def user_token(client, test_user):
    """获取测试用户的登录令牌"""
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    return response.json()["access_token"]

@pytest.fixture(scope="function")
def auth_headers(user_token):
    """带有授权头的请求头字典"""
    return {"Authorization": f"Bearer {user_token}"}

@pytest.fixture(scope="function")
def test_event(db, test_user):
    """创建测试活动"""
    event_data = {
        "title": "Test Event",
        "description": "This is a test event",
        "location": "Test Location",
        "event_time": "2025-08-01T12:00:00",
        "capacity": 10,
        "price": 1000,
        "creator_id": test_user.id
    }
    event = models.Event(**event_data)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event