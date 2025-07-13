from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# 用户相关 Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# 认证相关 Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# 活动相关 Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    event_time: datetime
    capacity: int
    price: int = 0

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    event_time: Optional[datetime] = None
    capacity: Optional[int] = None
    price: Optional[int] = None

class EventOut(EventBase):
    id: int
    status: str
    creator_id: int
    created_at: datetime
    creator: UserOut
    registered_count: Optional[int] = 0

    class Config:
        from_attributes = True

# 订单相关 Schemas
class OrderBase(BaseModel):
    pass

class OrderCreate(OrderBase):
    event_id: int

class OrderOut(OrderBase):
    id: int
    user_id: int
    event_id: int
    status: str
    created_at: datetime
    event: EventOut

    class Config:
        from_attributes = True

# 评论相关 Schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    event_id: int

class CommentOut(CommentBase):
    id: int
    user_id: int
    event_id: int
    created_at: datetime
    user: UserOut

    class Config:
        from_attributes = True

# 搜索和分页 Schemas
class EventSearchParams(BaseModel):
    search: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    location: Optional[str] = None
    status: Optional[str] = "active"
    page: int = 1
    limit: int = 10

class PaginatedResponse(BaseModel):
    items: List[EventOut]
    total: int
    page: int
    limit: int
    pages: int
