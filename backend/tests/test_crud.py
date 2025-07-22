# import pytest
# from app.crud.user import create_user, get_user, get_user_by_email
# from app.crud.item import create_item, get_item, get_items, update_item, delete_item
# from app.schemas.user import UserCreate
# from app.schemas.item import ItemCreate, ItemUpdate

# def test_create_user(db_session):
#     """测试创建用户CRUD操作"""
#     user_in = UserCreate(
#         email="test@example.com",
#         password="testpassword",
#         username="testuser"
#     )
#     user = create_user(db=db_session, user_in=user_in)
#     assert user.email == user_in.email
#     assert user.username == user_in.username
#     assert hasattr(user, "hashed_password")
    
#     # 测试获取用户
#     retrieved_user = get_user(db=db_session, user_id=user.id)
#     assert retrieved_user
#     assert retrieved_user.id == user.id
    
#     # 测试通过电子邮件获取用户
#     email_user = get_user_by_email(db=db_session, email=user.email)
#     assert email_user
#     assert email_user.id == user.id

# def test_item_crud(db_session):
#     """测试Item的CRUD操作"""
#     # 创建用户
#     user_in = UserCreate(
#         email="test@example.com",
#         password="testpassword",
#         username="testuser"
#     )
#     user = create_user(db=db_session, user_in=user_in)
    
#     # 创建项目
#     item_in = ItemCreate(
#         title="Test Item",
#         description="Description for test item"
#     )
#     item = create_item(db=db_session, item_in=item_in, owner_id=user.id)
#     assert item.title == item_in.title
#     assert item.description == item_in.description
#     assert item.owner_id == user.id
    
#     # 获取项目
#     retrieved_item = get_item(db=db_session, item_id=item.id)
#     assert retrieved_item
#     assert retrieved_item.id == item.id
    
#     # 获取所有项目
#     items = get_items(db=db_session, owner_id=user.id)
#     assert len(items) == 1
#     assert items[0].id == item.id
    
#     # 更新项目
#     item_update = ItemUpdate(title="Updated Item")
#     updated_item = update_item(db=db_session, item_id=item.id, item_in=item_update)
#     assert updated_item.title == "Updated Item"
#     assert updated_item.description == item.description  # 未更新的字段保持不变
    
#     # 删除项目
#     delete_item(db=db_session, item_id=item.id)
#     deleted_item = get_item(db=db_session, item_id=item.id)
#     assert deleted_item is None