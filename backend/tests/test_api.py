"""
API 端点测试
"""
import pytest
from fastapi.testclient import TestClient


class TestHealthCheck:
    """健康检查测试"""
    
    def test_root_endpoint(self, client: TestClient):
        """测试根端点"""
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
    
    def test_docs_endpoint(self, client: TestClient):
        """测试API文档端点"""
        response = client.get("/docs")
        assert response.status_code == 200


class TestAuthentication:
    """认证功能测试"""
    
    def test_register_user(self, client: TestClient, test_user_data):
        """测试用户注册"""
        response = client.post("/auth/register", json=test_user_data)
        assert response.status_code in [200, 201]
        data = response.json()
        assert "id" in data or "message" in data
    
    def test_register_duplicate_user(self, client: TestClient, test_user_data):
        """测试重复用户注册"""
        # 首次注册
        client.post("/auth/register", json=test_user_data)
        # 重复注册
        response = client.post("/auth/register", json=test_user_data)
        assert response.status_code == 400
    
    def test_login_valid_user(self, client: TestClient, test_user_data):
        """测试有效用户登录"""
        # 先注册用户
        client.post("/auth/register", json=test_user_data)
        
        # 登录
        login_data = {
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        }
        response = client.post("/auth/login", data=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
    
    def test_login_invalid_user(self, client: TestClient):
        """测试无效用户登录"""
        login_data = {
            "username": "nonexistent",
            "password": "wrongpassword"
        }
        response = client.post("/auth/login", data=login_data)
        assert response.status_code == 401


class TestEvents:
    """活动管理测试"""
    
    def get_auth_headers(self, client: TestClient, test_user_data):
        """获取认证头"""
        # 注册并登录用户
        client.post("/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        }
        response = client.post("/auth/login", data=login_data)
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_events_list(self, client: TestClient):
        """测试获取活动列表"""
        response = client.get("/events/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_create_event_authenticated(self, client: TestClient, test_user_data, test_event_data):
        """测试认证用户创建活动"""
        headers = self.get_auth_headers(client, test_user_data)
        response = client.post("/events/", json=test_event_data, headers=headers)
        assert response.status_code in [200, 201]
        data = response.json()
        assert data["title"] == test_event_data["title"]
    
    def test_create_event_unauthenticated(self, client: TestClient, test_event_data):
        """测试未认证用户创建活动"""
        response = client.post("/events/", json=test_event_data)
        assert response.status_code == 401
    
    def test_get_event_detail(self, client: TestClient, test_user_data, test_event_data):
        """测试获取活动详情"""
        headers = self.get_auth_headers(client, test_user_data)
        
        # 先创建一个活动
        response = client.post("/events/", json=test_event_data, headers=headers)
        event_id = response.json()["id"]
        
        # 获取活动详情
        response = client.get(f"/events/{event_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == event_id


class TestOrders:
    """订单管理测试"""
    
    def get_auth_headers(self, client: TestClient, test_user_data):
        """获取认证头"""
        client.post("/auth/register", json=test_user_data)
        login_data = {
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        }
        response = client.post("/auth/login", data=login_data)
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_user_orders(self, client: TestClient, test_user_data):
        """测试获取用户订单"""
        headers = self.get_auth_headers(client, test_user_data)
        response = client.get("/orders/my", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_orders_unauthenticated(self, client: TestClient):
        """测试未认证用户获取订单"""
        response = client.get("/orders/my")
        assert response.status_code == 401
