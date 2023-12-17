from pydantic import BaseModel, Field
from datetime import datetime

class OrderUserDetail(BaseModel):
    order_detail_id: int = Field(..., alias='order_detail_id')
    product_id: int = Field(..., alias='product_id')
    order_id: int = Field(..., alias='order_id')
    status: str = Field(..., alias='status')
    amount: float = Field(..., alias='amount')
    created_at: datetime = Field(..., alias='created_at')
    user_id: int = Field(..., alias='user_id')
    email: str = Field(..., alias='email')
    username: str = Field(..., alias='username')
    registered_at: datetime = Field(..., alias='registered_at')


class CreateOrderModel(BaseModel):
    order_status: str
    order_amount: int
    product_id: int