from pydantic import BaseModel

class CategoryModel(BaseModel):
    id: int
    name: str