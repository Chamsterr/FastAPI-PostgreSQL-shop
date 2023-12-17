from fastapi import APIRouter, Depends
from sqlalchemy import select, insert, func, text, outparam
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from database import get_async_session
from store.models import category, product, order, comment, order_detail
from store.categories.schemas import CategoryModel
from auth.base_config import fastapi_users
from auth.models import User

router = APIRouter(
    prefix="/catergory",
    tags=["Catergory"]
)

current_active_verified_user = fastapi_users.current_user(active=True, verified=True, superuser=True)

@router.get("/get_categories", response_model=list[CategoryModel])
async def get_all_categories(session: AsyncSession = Depends(get_async_session)):
    query = select(func.get_all_categories())
    result = await session.execute(query)
    products = result.scalars().all()
    return [dict(product) for product in products]