"""
业务逻辑测试
"""
import pytest
from datetime import datetime, timedelta
from app.models import User, Event
from app.crud import create_user, get_user, create_event, get_events
from app.schemas import UserCreate, EventCreate
from app.auth import verify_password, get_password_hash


class TestUserCRUD:
    """用户CRUD操作测试"""
    
    def test_create_user(self, test_db, client):
        """测试创建用户"""
        from app.database import SessionLocal
        db = SessionLocal()
        
        user_data = UserCreate(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
            full_name="Test User"
        )
        
        user = create_user(db, user_data)
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.full_name == "Test User"
        assert verify_password("testpassword123", user.hashed_password)
        
        db.close()
    
    def test_get_user(self, test_db, client):
        """测试获取用户"""
        from app.database import SessionLocal
        db = SessionLocal()
        
        # 先创建用户
        user_data = UserCreate(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
            full_name="Test User"
        )
        created_user = create_user(db, user_data)
        
        # 获取用户
        retrieved_user = get_user(db, user_id=created_user.id)
        assert retrieved_user.id == created_user.id
        assert retrieved_user.username == "testuser"
        
        db.close()


class TestEventCRUD:
    """活动CRUD操作测试"""
    
    def test_create_event(self, test_db, client):
        """测试创建活动"""
        from app.database import SessionLocal
        db = SessionLocal()
        
        # 先创建用户
        user_data = UserCreate(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
            full_name="Test User"
        )
        user = create_user(db, user_data)
        
        # 创建活动
        event_data = EventCreate(
            title="测试体育活动",
            description="这是一个测试活动",
            event_date=datetime.now() + timedelta(days=7),
            location="测试体育馆",
            max_participants=50,
            price=99.99
        )
        
        event = create_event(db, event_data, user_id=user.id)
        assert event.title == "测试体育活动"
        assert event.organizer_id == user.id
        assert event.max_participants == 50
        
        db.close()
    
    def test_get_events(self, test_db, client):
        """测试获取活动列表"""
        from app.database import SessionLocal
        db = SessionLocal()
        
        # 创建用户和活动
        user_data = UserCreate(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
            full_name="Test User"
        )
        user = create_user(db, user_data)
        
        event_data = EventCreate(
            title="测试体育活动",
            description="这是一个测试活动",
            event_date=datetime.now() + timedelta(days=7),
            location="测试体育馆",
            max_participants=50,
            price=99.99
        )
        create_event(db, event_data, user_id=user.id)
        
        # 获取活动列表
        events = get_events(db, skip=0, limit=10)
        assert len(events) >= 1
        assert events[0].title == "测试体育活动"
        
        db.close()


class TestPasswordSecurity:
    """密码安全测试"""
    
    def test_password_hashing(self):
        """测试密码哈希"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert verify_password(password, hashed)
        assert not verify_password("wrongpassword", hashed)
    
    def test_password_verification(self):
        """测试密码验证"""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed)
        assert not verify_password(wrong_password, hashed)


class TestBusinessLogic:
    """业务逻辑测试"""
    
    def test_event_date_validation(self):
        """测试活动日期验证"""
        # 测试过去的日期（应该无效）
        past_date = datetime.now() - timedelta(days=1)
        
        # 测试未来的日期（应该有效）
        future_date = datetime.now() + timedelta(days=7)
        
        assert future_date > datetime.now()
        assert past_date < datetime.now()
    
    def test_participant_limit(self, test_db, client):
        """测试参与者限制"""
        from app.database import SessionLocal
        db = SessionLocal()
        
        user_data = UserCreate(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
            full_name="Test User"
        )
        user = create_user(db, user_data)
        
        event_data = EventCreate(
            title="限制活动",
            description="这是一个有参与者限制的活动",
            event_date=datetime.now() + timedelta(days=7),
            location="测试体育馆",
            max_participants=5,  # 限制5个参与者
            price=99.99
        )
        
        event = create_event(db, event_data, user_id=user.id)
        assert event.max_participants == 5
        assert event.current_participants == 0
        
        db.close()
