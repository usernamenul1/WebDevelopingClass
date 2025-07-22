# import pytest
# from app.models.user import User
# from app.services.auth import create_access_token, verify_password, get_password_hash

# def test_password_hashing():
#     """测试密码哈希功能"""
#     password = "securepassword123"
#     hashed = get_password_hash(password)
#     assert hashed != password
#     assert verify_password(password, hashed) is True
#     assert verify_password("wrongpassword", hashed) is False

# def test_token_creation():
#     """测试JWT令牌创建"""
#     token = create_access_token({"sub": "user@example.com"})
#     assert isinstance(token, str)
#     assert len(token) > 0

# def test_user_registration(client):
#     """测试用户注册API"""
#     user_data = {
#         "email": "test@example.com",
#         "password": "securepassword123",
#         "username": "testuser"
#     }
#     response = client.post("/api/users/register", json=user_data)
#     assert response.status_code == 201
#     data = response.json()
#     assert data["email"] == user_data["email"]
#     assert "id" in data
#     assert "password" not in data  # 确保不返回密码