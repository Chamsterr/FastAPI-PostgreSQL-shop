from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy import select, insert, func, text, outparam
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from database import get_async_session
from store.models import category, product, order, comment, order_detail
from store.orders.schemas import OrderUserDetail, CreateOrderModel
from auth.base_config import fastapi_users
from auth.models import User

router = APIRouter(
    prefix="/order",
    tags=["Orders"]
)


current_active_verified_user = fastapi_users.current_user(
    active=True)


@router.get("/get_user_orders", response_model=list[OrderUserDetail])
async def get_user_orders(session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_verified_user)):
    try:
        query = select(func.get_user_orders(user.id))
        result = await session.execute(query)
        comments = result.scalars().all()
        return [dict(comment) for comment in comments]
    except SQLAlchemyError as e:
        return {"error": "A database error occurred", "details": str(e)}


@router.post("/create_order")
async def create_order(order: CreateOrderModel, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_verified_user)):
    query = text(
        "CALL create_order(:user_id, :order_status, :order_amount, :product_id, :result)")
    params = dict(order)
    params['user_id'] = user.id
    params['result'] = False
    try:
        result = await session.execute(query, params)
        success = result.scalar()
        await session.commit()
        return {"success": success}
    except IntegrityError as e:
        if 'unique_violation' in str(e.orig):
            return {"error": "Unique violation error occurred", "details": str(e)}
        else:
            return {"error": "Integrity error occurred", "details": str(e)}
    except SQLAlchemyError as e:
        return {"error": "A database error occurred", "details": str(e)}
