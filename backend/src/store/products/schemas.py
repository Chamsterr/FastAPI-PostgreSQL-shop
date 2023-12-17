from pydantic import BaseModel

class ProductModel(BaseModel):
    id: int
    name: str
    weight: float
    description: str
    image: bytes
    stock: int
    price: float
    category_id: int

class AddProductModel(BaseModel):
    name: str
    weight: float
    description: str
    image: bytes
    stock: int
    price: float
    category_id: int