from pydantic import BaseModel, Field
from datetime import datetime

class OrderUserDetail(BaseModel):
    order_id: int = Field(..., alias='order_id')
    status: str = Field(..., alias='status')
    amount: float = Field(..., alias='amount')
    created_at: datetime = Field(..., alias='created_at')
    user_id: int = Field(..., alias='user_id')
    user_name: str = Field(..., alias='user_name')
    product_id: int = Field(..., alias='product_id')
    product_name: str = Field(..., alias='product_name')



class CreateOrderModel(BaseModel):
    order_status: str
    order_amount: int
    product_id: int