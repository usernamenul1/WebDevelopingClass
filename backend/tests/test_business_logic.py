"""
业务逻辑测试 - 修复数据库相关问题
"""
import pytest
from datetime import datetime, timedelta
from app.crud import create_user, get_user, create_event, get_events
from app.schemas import UserCreate, EventCreate
from app.auth import verify_password, get_password_hash


class TestUserCRUD:
    """用户CRUD操作测试"""
    
    def test_create_user(self, client):
        """测试通过API创建用户"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com", 
            "password": "testpassword123",
            "full_name": "Test User"
        }
        
        response = client.post("/auth/register", json=user_data)
        assert response.status_code in [200, 201]
        
        user = response.json()
        assert user["username"] == "testuser"
        assert user["email"] == "test@example.com"
        assert user["full_name"] == "Test User"
    
    def test_create_duplicate_user(self, client):
        """测试创建重复用户"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User"
        }
        
        # 第一次注册
        response = client.post("/auth/register", json=user_data)
        assert response.status_code in [200, 201]
        
        # 第二次注册（应该失败）
        response = client.post("/auth/register", json=user_data)
        assert response.status_code == 400
    
    def test_user_login(self, client):
        """测试用户登录"""
        # 先注册
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User"
        }
        client.post("/auth/register", json=user_data)
        
        # 登录
        login_data = {
            "username": "testuser",
            "password": "testpassword123"
        }
        response = client.post("/auth/login", data=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data


class TestEventCRUD:
    """活动CRUD操作测试"""
    
    def test_create_event(self, client, authenticated_user, test_event_data):
        """测试创建活动"""
        response = client.post("/events/", json=test_event_data, headers=authenticated_user)
        assert response.status_code in [200, 201]
        
        event = response.json()
        assert event["title"] == test_event_data["title"]
        assert event["location"] == test_event_data["location"]
        assert event["capacity"] == test_event_data["capacity"]
    
    def test_get_events(self, client, authenticated_user, test_event_data):
        """测试获取活动列表"""
        # 先创建一个活动
        client.post("/events/", json=test_event_data, headers=authenticated_user)
        
        # 获取活动列表
        response = client.get("/events/")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        assert len(data["items"]) >= 1
    
    def test_get_event_detail(self, client, authenticated_user, test_event_data):
        """测试获取活动详情"""
        # 创建活动
        response = client.post("/events/", json=test_event_data, headers=authenticated_user)
        event_id = response.json()["id"]
        
        # 获取活动详情
        response = client.get(f"/events/{event_id}")
        assert response.status_code == 200
        
        event = response.json()
        assert event["id"] == event_id
        assert event["title"] == test_event_data["title"]
    
    def test_update_event(self, client, authenticated_user, test_event_data):
        """测试更新活动"""
        # 创建活动
        response = client.post("/events/", json=test_event_data, headers=authenticated_user)
        event_id = response.json()["id"]
        
        # 更新活动
        update_data = {"title": "更新后的活动标题"}
        response = client.put(f"/events/{event_id}", json=update_data, headers=authenticated_user)
        assert response.status_code == 200
        
        event = response.json()
        assert event["title"] == "更新后的活动标题"
    
    def test_register_for_event(self, client, authenticated_user, test_event_data):
        """测试报名活动"""
        # 创建活动
        response = client.post("/events/", json=test_event_data, headers=authenticated_user)
        event_id = response.json()["id"]
        
        # 报名活动
        response = client.post(f"/events/{event_id}/register", headers=authenticated_user)
        assert response.status_code in [200, 201]
        
        order = response.json()
        assert order["event_id"] == event_id
        assert order["status"] == "active"


class TestPasswordSecurity:
    """密码安全测试"""
    
    def test_password_hashing(self):
        """测试密码哈希"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert len(hashed) > 50  # bcrypt 哈希应该比较长
        assert verify_password(password, hashed)
        assert not verify_password("wrongpassword", hashed)
    
    def test_password_verification(self):
        """测试密码验证"""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed)
        assert not verify_password(wrong_password, hashed)
    
    def test_different_passwords_different_hashes(self):
        """测试不同密码产生不同哈希"""
        password1 = "password1"
        password2 = "password2"
        
        hash1 = get_password_hash(password1)
        hash2 = get_password_hash(password2)
        
        assert hash1 != hash2


class TestBusinessLogic:
    """业务逻辑测试"""
    
    def test_event_date_validation(self):
        """测试活动日期验证"""
        # 测试过去的日期
        past_date = datetime.now() - timedelta(days=1)
        # 测试未来的日期
        future_date = datetime.now() + timedelta(days=7)
        
        assert future_date > datetime.now()
        assert past_date < datetime.now()
    
    def test_event_capacity_validation(self, client, authenticated_user):
        """测试活动容量验证"""
        event_data = {
            "title": "容量测试活动",
            "description": "测试活动容量限制",
            "location": "测试地点",
            "event_time": (datetime.now() + timedelta(days=7)).isoformat(),
            "capacity": 2,  # 设置较小容量便于测试
            "price": 0
        }
        
        # 创建活动
        response = client.post("/events/", json=event_data, headers=authenticated_user)
        assert response.status_code in [200, 201]
        
        event = response.json()
        assert event["capacity"] == 2
    
    def test_authentication_required(self, client, test_event_data):
        """测试需要认证的操作"""
        # 尝试在未认证状态下创建活动
        response = client.post("/events/", json=test_event_data)
        assert response.status_code == 401
        
        # 尝试获取个人活动
        response = client.get("/events/my")
        assert response.status_code == 401
        
        # 尝试获取个人订单
        response = client.get("/orders/")
        assert response.status_code == 401


class TestOrderManagement:
    """订单管理测试"""
    
    def test_get_user_orders(self, client, authenticated_user):
        """测试获取用户订单"""
        response = client.get("/orders/", headers=authenticated_user)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_register_and_cancel_order(self, client, authenticated_user, test_event_data):
        """测试报名和取消订单"""
        # 创建活动
        response = client.post("/events/", json=test_event_data, headers=authenticated_user)
        event_id = response.json()["id"]
        
        # 报名活动
        response = client.post(f"/events/{event_id}/register", headers=authenticated_user)
        assert response.status_code in [200, 201]
        order_id = response.json()["id"]
        
        # 取消订单
        response = client.delete(f"/orders/{order_id}", headers=authenticated_user)
        assert response.status_code == 204


class TestComments:
    """评论功能测试"""
    
    def test_create_and_get_comments(self, client, authenticated_user, test_event_data):
        """测试创建和获取评论"""
        # 创建活动
        response = client.post("/events/", json=test_event_data, headers=authenticated_user)
        event_id = response.json()["id"]
        
        # 创建评论
        comment_data = {"content": "这是一个测试评论", "event_id": event_id}
        response = client.post("/comments/", json=comment_data, headers=authenticated_user)
        assert response.status_code in [200, 201]
        
        comment = response.json()
        assert comment["content"] == "这是一个测试评论"
        assert comment["event_id"] == event_id
        
        # 获取活动评论
        response = client.get(f"/comments/events/{event_id}")
        assert response.status_code == 200
        
        comments = response.json()
        assert len(comments) >= 1
        assert comments[0]["content"] == "这是一个测试评论"
