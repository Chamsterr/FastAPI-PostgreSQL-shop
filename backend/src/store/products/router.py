from fastapi import APIRouter, Depends
from sqlalchemy import select, insert, func, text, outparam
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from database import get_async_session
from store.models import category, product, order, comment, order_detail
from store.products.schemas import ProductModel, AddProductModel
from auth.base_config import fastapi_users
from auth.models import User

router = APIRouter(
    prefix="/product",
    tags=["Product"]
)

current_active_verified_user = fastapi_users.current_user(active=True, verified=True)

@router.get("/get_product/{product_id}", response_model=ProductModel)
async def get_specific_product(product_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(product).where(product.c.id == product_id)
    result = await session.execute(query)
    return result.first()

@router.get("/get_products/{category_id}", response_model=list[ProductModel])
async def get_all_products(category_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(func.get_products_by_category_id(category_id ))
    result = await session.execute(query)
    products = result.scalars().all()
    return [dict(product) for product in products]

@router.post("/add_product")
async def add_product(product: AddProductModel, session: AsyncSession = Depends(get_async_session), user: User = Depends(current_active_verified_user)):
    query = text("CALL add_product(:name, :weight, :description, :image, :stock, :price, :category_id, :result)")
    params = dict(product)
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