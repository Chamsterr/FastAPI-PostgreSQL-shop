from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile

class ProductModel(BaseModel):
    id: int
    name: str
    weight: float
    description: str
    image: Optional[str]
    stock: int
    price: float
    category_id: int

class AddProductModel(BaseModel):
    name: str
    weight: float
    description: str
    image: str
    stock: int
    price: float
    category: int

class UpdateProductModel(BaseModel):
    id: int
    name: str
    weight: float
    description: str
    image: str
    stock: int
    price: float
    category: int
