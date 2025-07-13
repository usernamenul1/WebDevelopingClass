"""
数据库初始化脚本
用于创建初始数据和测试数据
"""

from app.database import SessionLocal, engine
from app import models
from app.auth import get_password_hash
from datetime import datetime, timedelta

def init_db():
    """初始化数据库"""
    print("正在创建数据库表...")
    models.Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")

def create_test_data():
    """创建测试数据"""
    db = SessionLocal()
    
    try:
        print("正在创建测试数据...")
        
        # 创建测试用户
        test_users = [
            {
                "username": "admin",
                "email": "admin@example.com",
                "hashed_password": get_password_hash("admin123"),
                "full_name": "管理员",
                "phone": "13800138000"
            },
            {
                "username": "user1",
                "email": "user1@example.com", 
                "hashed_password": get_password_hash("user123"),
                "full_name": "张三",
                "phone": "13800138001"
            },
            {
                "username": "user2",
                "email": "user2@example.com",
                "hashed_password": get_password_hash("user123"),
                "full_name": "李四",
                "phone": "13800138002"
            }
        ]
        
        for user_data in test_users:
            existing_user = db.query(models.User).filter(
                models.User.username == user_data["username"]
            ).first()
            
            if not existing_user:
                user = models.User(**user_data)
                db.add(user)
        
        db.commit()
        
        # 获取创建的用户
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        user1 = db.query(models.User).filter(models.User.username == "user1").first()
        
        # 创建测试活动
        test_events = [
            {
                "title": "周末篮球友谊赛",
                "description": "欢迎所有篮球爱好者参加！我们将在周末举行一场友谊赛，不论水平高低，只要热爱篮球就可以参加。活动包括热身、分组对抗、技术交流等环节。",
                "location": "北京市朝阳区奥林匹克公园篮球场",
                "event_time": datetime.now() + timedelta(days=7),
                "capacity": 20,
                "price": 0,
                "creator_id": admin.id
            },
            {
                "title": "晨跑健身活动",
                "description": "一起晨跑，健康生活！每周三次的晨跑活动，路线经过公园和湖边，风景优美，空气清新。适合所有年龄段的朋友参加。",
                "location": "北京市海淀区圆明园公园",
                "event_time": datetime.now() + timedelta(days=2),
                "capacity": 30,
                "price": 0,
                "creator_id": user1.id
            },
            {
                "title": "羽毛球培训班",
                "description": "专业教练指导的羽毛球培训班，适合初学者和进阶者。包括基础动作、技战术培训、实战练习等。提供球拍和羽毛球。",
                "location": "北京市东城区体育馆羽毛球厅",
                "event_time": datetime.now() + timedelta(days=5),
                "capacity": 16,
                "price": 5000,  # 50元
                "creator_id": admin.id
            },
            {
                "title": "足球联谊赛",
                "description": "公司间足球联谊赛，增进友谊，强身健体。比赛采用11人制，时间为上下半场各45分钟。欢迎各公司组队参加！",
                "location": "北京市丰台区工人体育场",
                "event_time": datetime.now() + timedelta(days=14),
                "capacity": 22,
                "price": 2000,  # 20元
                "creator_id": user1.id
            },
            {
                "title": "瑜伽冥想课程",
                "description": "放松身心的瑜伽冥想课程，由资深瑜伽师指导。适合初学者，不需要任何基础。课程包括基础瑜伽体式、呼吸练习和冥想。",
                "location": "北京市西城区瑜伽工作室",
                "event_time": datetime.now() + timedelta(days=3),
                "capacity": 15,
                "price": 8000,  # 80元
                "creator_id": admin.id
            }
        ]
        
        for event_data in test_events:
            existing_event = db.query(models.Event).filter(
                models.Event.title == event_data["title"]
            ).first()
            
            if not existing_event:
                event = models.Event(**event_data)
                db.add(event)
        
        db.commit()
        print("测试数据创建完成！")
        
        # 显示创建的数据统计
        user_count = db.query(models.User).count()
        event_count = db.query(models.Event).count()
        
        print(f"\n数据统计:")
        print(f"用户数量: {user_count}")
        print(f"活动数量: {event_count}")
        
        print(f"\n测试账号:")
        print(f"管理员 - 用户名: admin, 密码: admin123")
        print(f"普通用户1 - 用户名: user1, 密码: user123") 
        print(f"普通用户2 - 用户名: user2, 密码: user123")
        
    except Exception as e:
        print(f"创建测试数据时出错: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== 体育活动平台数据库初始化 ===\n")
    
    init_db()
    create_test_data()
    
    print("\n=== 初始化完成 ===")
    print("现在可以启动应用了！")
