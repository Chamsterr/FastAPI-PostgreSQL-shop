from fastapi import APIRouter, Depends
from database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from store.comments.schemas import CommentModel
from sqlalchemy import select, insert, func, text, outparam
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from store.comments.schemas import AddCommentModel


router = APIRouter(
    prefix="/comment",
    tags=["Comment"]
)

@router.get("/get_comments/{product_id}", response_model=list[CommentModel])
async def get_comments_by_product(product_id: int, session: AsyncSession = Depends(get_async_session)):
    try:
        query = select(func.get_comments_by_product_id(product_id))
        result = await session.execute(query)
        comments = result.scalars().all()
        return [dict(comment) for comment in comments]
    except SQLAlchemyError as e:
        return {"error": "A database error occurred", "details": str(e)}

@router.post("/add_comment")
async def add_comment(comment: AddCommentModel, session: AsyncSession = Depends(get_async_session)):
    query = text("CALL add_comment(:text, :user_id, :product_id, :result)")
    params = dict(comment)
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