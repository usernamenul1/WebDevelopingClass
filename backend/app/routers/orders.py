from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, dependencies
from ..database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=List[schemas.OrderOut])
def read_my_orders(
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取当前用户的订单列表"""
    return crud.get_user_orders(db=db, user_id=current_user.id)

@router.get("/{order_id}", response_model=schemas.OrderOut)
def read_order(
    order_id: int,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取订单详情"""
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if db_order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(
    order_id: int,
    current_user = Depends(dependencies.get_current_active_user),
    db: Session = Depends(get_db)
):
    """取消订单"""
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if db_order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if db_order.status != "active":
        raise HTTPException(status_code=400, detail="Order is already cancelled")
    
    crud.cancel_order(db=db, order_id=order_id, user_id=current_user.id)
