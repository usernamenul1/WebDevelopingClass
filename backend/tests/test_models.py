# import pytest
# from app.models.user import User
# from app.models.item import Item  # 假设您有一个Item模型

# def test_user_model(db_session):
#     """测试用户模型的创建和查询"""
#     user = User(
#         email="test@example.com",
#         username="testuser",
#         hashed_password="hashedpassword123"
#     )
#     db_session.add(user)
#     db_session.commit()
    
#     # 查询用户
#     retrieved_user = db_session.query(User).filter(User.email == "test@example.com").first()
#     assert retrieved_user is not None
#     assert retrieved_user.email == "test@example.com"
#     assert retrieved_user.username == "testuser"

# def test_item_model(db_session):
#     """测试Item模型及其与用户的关系"""
#     # 创建用户
#     user = User(
#         email="test@example.com",
#         username="testuser",
#         hashed_password="hashedpassword123"
#     )
#     db_session.add(user)
#     db_session.commit()
    
#     # 创建关联的项目
#     item = Item(
#         title="Test Item",
#         description="This is a test item",
#         owner_id=user.id
#     )
#     db_session.add(item)
#     db_session.commit()
    
#     # 查询项目
#     retrieved_item = db_session.query(Item).first()
#     assert retrieved_item is not None
#     assert retrieved_item.title == "Test Item"
#     assert retrieved_item.owner_id == user.id