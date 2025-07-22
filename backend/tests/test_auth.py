def test_register_user(client):
    """测试用户注册功能"""
    response = client.post(
        "/auth/register",
        json={
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpassword",
            "full_name": "New User",
            "phone": "9876543210"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "id" in data

def test_register_duplicate_username(client, test_user):
    """测试注册重复用户名"""
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",  # 已存在的用户名
            "email": "another@example.com",
            "password": "password123",
            "full_name": "Another User"
        }
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_user(client, test_user):
    """测试用户登录功能"""
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    """测试无效凭据登录"""
    response = client.post(
        "/auth/login",
        data={"username": "wronguser", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_get_current_user(client, auth_headers):
    """测试获取当前用户信息"""
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"