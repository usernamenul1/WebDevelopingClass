from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, dependencies
from ..database import get_db

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/", response_model=schemas.CommentOut)
def create_comment(
    comment: schemas.CommentCreate,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """创建评论"""
    # 检查活动是否存在
    db_event = crud.get_event(db, event_id=comment.event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return crud.create_comment(db=db, comment=comment, user_id=current_user.id)

@router.get("/events/{event_id}", response_model=List[schemas.CommentOut])
def read_event_comments(event_id: int, db: Session = Depends(get_db)):
    """获取活动的所有评论"""
    # 检查活动是否存在
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return crud.get_event_comments(db=db, event_id=event_id)

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """删除评论"""
    deleted_comment = crud.delete_comment(db=db, comment_id=comment_id, user_id=current_user.id)
    if deleted_comment is None:
        raise HTTPException(
            status_code=404, 
            detail="Comment not found or you don't have permission to delete it"
        )
