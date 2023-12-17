from pydantic import BaseModel

class CommentModel(BaseModel):
    id: int
    text: str
    user_id: int
    product_id: int

class AddCommentModel(BaseModel):
    text: str
    user_id: int
    product_id: int