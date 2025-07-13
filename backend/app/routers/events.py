from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import math

from .. import crud, schemas, dependencies
from ..database import get_db

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/", response_model=schemas.EventOut)
def create_event(
    event: schemas.EventCreate,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """创建活动"""
    db_event = crud.create_event(db=db, event=event, creator_id=current_user.id)
    
    # 添加注册人数信息
    db_event.registered_count = crud.get_event_registered_count(db, db_event.id)
    
    return db_event

@router.get("/", response_model=schemas.PaginatedResponse)
def read_events(
    search: Optional[str] = Query(None, description="搜索关键词"),
    date_from: Optional[datetime] = Query(None, description="开始日期"),
    date_to: Optional[datetime] = Query(None, description="结束日期"),
    location: Optional[str] = Query(None, description="地点"),
    status: str = Query("active", description="活动状态"),
    page: int = Query(1, ge=1, description="页码"),
    limit: int = Query(10, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """获取活动列表（支持搜索和分页）"""
    skip = (page - 1) * limit
    
    events = crud.get_events(
        db=db,
        search=search,
        date_from=date_from,
        date_to=date_to,
        location=location,
        status=status,
        skip=skip,
        limit=limit
    )
    
    total = crud.get_events_count(
        db=db,
        search=search,
        date_from=date_from,
        date_to=date_to,
        location=location,
        status=status
    )
    
    # 为每个活动添加注册人数
    for event in events:
        event.registered_count = crud.get_event_registered_count(db, event.id)
    
    pages = math.ceil(total / limit)
    
    return {
        "items": events,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

@router.get("/my", response_model=List[schemas.EventOut])
def read_my_events(
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取当前用户创建的活动"""
    events = crud.get_user_events(db=db, user_id=current_user.id)
    
    # 为每个活动添加注册人数
    for event in events:
        event.registered_count = crud.get_event_registered_count(db, event.id)
    
    return events

@router.get("/{event_id}", response_model=schemas.EventOut)
def read_event(event_id: int, db: Session = Depends(get_db)):
    """获取活动详情"""
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # 添加注册人数信息
    db_event.registered_count = crud.get_event_registered_count(db, event_id)
    
    return db_event

@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(
    event_id: int,
    event_update: schemas.EventUpdate,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """更新活动"""
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if db_event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    updated_event = crud.update_event(db=db, event_id=event_id, event_update=event_update)
    
    # 添加注册人数信息
    updated_event.registered_count = crud.get_event_registered_count(db, event_id)
    
    return updated_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """删除活动"""
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if db_event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    crud.delete_event(db=db, event_id=event_id)

@router.post("/{event_id}/register", response_model=schemas.OrderOut)
def register_for_event(
    event_id: int,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """报名参加活动"""
    # 检查活动是否存在
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # 检查活动状态
    if db_event.status != "active":
        raise HTTPException(status_code=400, detail="Event is not active")
    
    # 检查活动时间
    if db_event.event_time < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Event has already passed")
    
    # 创建订单
    db_order = crud.create_order(db=db, user_id=current_user.id, event_id=event_id)
    
    if db_order is None:
        raise HTTPException(
            status_code=400, 
            detail="Already registered or event is full"
        )
    
    return db_order
