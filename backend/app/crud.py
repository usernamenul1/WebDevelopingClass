from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime
from . import models, schemas, auth

# 用户 CRUD 操作
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 活动 CRUD 操作
def create_event(db: Session, event: schemas.EventCreate, creator_id: int):
    db_event = models.Event(**event.dict(), creator_id=creator_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def get_events(
    db: Session, 
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    location: Optional[str] = None,
    status: str = "active",
    skip: int = 0,
    limit: int = 10
):
    query = db.query(models.Event).filter(models.Event.status == status)
    
    if search:
        query = query.filter(
            or_(
                models.Event.title.contains(search),
                models.Event.description.contains(search)
            )
        )
    
    if date_from:
        query = query.filter(models.Event.event_time >= date_from)
    
    if date_to:
        query = query.filter(models.Event.event_time <= date_to)
    
    if location:
        query = query.filter(models.Event.location.contains(location))
    
    return query.offset(skip).limit(limit).all()

def get_events_count(
    db: Session,
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    location: Optional[str] = None,
    status: str = "active"
):
    query = db.query(models.Event).filter(models.Event.status == status)
    
    if search:
        query = query.filter(
            or_(
                models.Event.title.contains(search),
                models.Event.description.contains(search)
            )
        )
    
    if date_from:
        query = query.filter(models.Event.event_time >= date_from)
    
    if date_to:
        query = query.filter(models.Event.event_time <= date_to)
    
    if location:
        query = query.filter(models.Event.location.contains(location))
    
    return query.count()

def get_user_events(db: Session, user_id: int):
    return db.query(models.Event).filter(models.Event.creator_id == user_id).all()

def update_event(db: Session, event_id: int, event_update: schemas.EventUpdate):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        update_data = event_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_event, field, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event

# 订单 CRUD 操作
def create_order(db: Session, user_id: int, event_id: int):
    # 检查是否已经报名
    existing_order = db.query(models.Order).filter(
        and_(models.Order.user_id == user_id, models.Order.event_id == event_id, models.Order.status == "active")
    ).first()
    
    if existing_order:
        return None
    
    # 检查活动容量
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        return None
    
    registered_count = db.query(models.Order).filter(
        and_(models.Order.event_id == event_id, models.Order.status == "active")
    ).count()
    
    if registered_count >= event.capacity:
        return None
    
    db_order = models.Order(user_id=user_id, event_id=event_id)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_user_orders(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def cancel_order(db: Session, order_id: int, user_id: int):
    db_order = db.query(models.Order).filter(
        and_(models.Order.id == order_id, models.Order.user_id == user_id)
    ).first()
    
    if db_order:
        db_order.status = "cancelled"
        db_order.cancelled_at = datetime.utcnow()
        db.commit()
        db.refresh(db_order)
    
    return db_order

# 评论 CRUD 操作
def create_comment(db: Session, comment: schemas.CommentCreate, user_id: int):
    db_comment = models.Comment(**comment.dict(), user_id=user_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_event_comments(db: Session, event_id: int):
    return db.query(models.Comment).filter(models.Comment.event_id == event_id).all()

def delete_comment(db: Session, comment_id: int, user_id: int):
    db_comment = db.query(models.Comment).filter(
        and_(models.Comment.id == comment_id, models.Comment.user_id == user_id)
    ).first()
    
    if db_comment:
        db.delete(db_comment)
        db.commit()
    
    return db_comment

def get_event_registered_count(db: Session, event_id: int):
    return db.query(models.Order).filter(
        and_(models.Order.event_id == event_id, models.Order.status == "active")
    ).count()
