# import pytest
# from fastapi.testclient import TestClient
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.pool import StaticPool

# # 在导入 app 前先设置测试环境
# import os
# os.environ["TESTING"] = "True"
# os.environ["DATABASE_URL"] = "sqlite:///:memory:"

# # 修正导入路径
# from app.database import Base, get_db
# from app import main

# # 创建测试数据库
# SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL,
#     connect_args={"check_same_thread": False},
#     poolclass=StaticPool,
# )
# TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# # 修补 app 中的数据库依赖
# def override_get_db():
#     try:
#         db = TestingSessionLocal()
#         yield db
#     finally:
#         db.close()


# main.app.dependency_overrides[get_db] = override_get_db


# @pytest.fixture(scope="function")
# def db():
#     Base.metadata.create_all(bind=engine)
#     yield TestingSessionLocal()
#     Base.metadata.drop_all(bind=engine)


# @pytest.fixture(scope="function")
# def client(db):
#     """创建测试客户端"""
#     # 直接使用 FastAPI 的 TestClient
#     from fastapi.testclient import TestClient
#     test_client = TestClient(main.app)
#     return test_client