# import pytest

# def test_read_main(client):
#     """测试根路由是否返回正确状态码"""
#     response = client.get("/")
#     assert response.status_code == 200
#     assert "Welcome" in response.json().get("message", "")

# def test_health_check(client):
#     """测试健康检查端点"""
#     response = client.get("/health")
#     assert response.status_code == 200
#     assert response.json() == {"status": "ok"}

# def test_docs_accessible(client):
#     """测试Swagger文档是否可访问"""
#     response = client.get("/docs")
#     assert response.status_code == 200