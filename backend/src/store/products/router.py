from fastapi import APIRouter, Depends
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from database import get_async_session
from store.models import Product
from store.products.schemas import ProductModel, AddProductModel, UpdateProductModel
from auth.base_config import fastapi_users
from auth.models import User
import base64

router = APIRouter(
    prefix="/product",
    tags=["Product"]
)

current_active_verified_user = fastapi_users.current_user(active=True, verified=True)

@router.get("/get_product/{product_id}", response_model=ProductModel)
async def get_specific_product(product_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(Product).where(Product.id == product_id)
    result = await session.execute(query)
    product = result.scalar_one()
    
    product_dict = product.__dict__
    product_dict["image"] = "data:image/png;base64," + base64.b64encode(product_dict["image"]).decode()
    return product_dict

@router.get("/get_products/{category_id}", response_model=list[ProductModel])
async def get_all_products(category_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(func.get_products_by_category_id(category_id ))
    result = await session.execute(query)
    products = result.scalars().all()
    product_dicts = []
    for product in products:
        product_dict = dict(product)
        product_dict["image"] = "data:image/png;base64," + base64.b64encode(product_dict["image"]).decode()
        product_dicts.append(product_dict)
    return product_dicts

@router.post("/add_product")
async def add_product(product: AddProductModel, session: AsyncSession = Depends(get_async_session)):
    import base64
    base64_data = product.image.split(',')[1]
    bytes_data = base64.b64decode(base64_data)

    query = text("CALL add_product(:name, :weight, :description, :image, :stock, :price, :category, :result)")
    params = dict(product)
    params['image'] = bytes_data
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

@router.put("/update_product")
async def update_product(product: UpdateProductModel, session: AsyncSession = Depends(get_async_session)):
    base64_data = product.image.split(',')[1]
    bytes_data = base64.b64decode(base64_data)

    query = text("CALL update_product(:id, :name, :weight, :description, :image, :stock, :price, :category, :result)")
    params = dict(product)
    params['image'] = bytes_data
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