from fastapi import FastAPI
from store.products.router import router as router_products
from store.comments.router import router as router_comments
from store.orders.router import router as router_orders
from store.categories.router import router as router_categories
from wtforms import FileField
from fastapi.middleware.cors import CORSMiddleware
from auth.base_config import auth_backend, fastapi_users
from auth.schemas import UserRead, UserCreate, UserUpdate
from database import engin
from auth.models import User
from store.models import Category, Order, Product, Comment
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend

app = FastAPI(
    title="Trading App"
)
admin = Admin(app, engin)


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.username]
    can_export = False
    column_searchable_list = [User.username]

class CategoryAdmin(ModelView, model=Category):
    column_list = [Category.id, Category.name, Category.products]
    column_searchable_list = [Category.name]
    can_export = False

class ProductAdmin(ModelView, model=Product):
    column_list = [Product.name, Product.category, Product.weight, Product.price, Product.stock]
    create_template = "create_product.html"
    edit_template = "edit_image_product.html"
    can_export = False
    column_searchable_list = [Product.name]

class CommentAdmin(ModelView, model=Comment):
    can_export = False

class OrderAdmin(ModelView, model=Order):
    column_details_list = [Order.id, Order.status]
    column_list = [Order.id, Order.status]
    column_searchable_list = [Order.id]
    can_export = False

admin.add_view(UserAdmin)
admin.add_view(CategoryAdmin)
admin.add_view(ProductAdmin)
admin.add_view(OrderAdmin)
admin.add_view(CommentAdmin)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["Auth"],
)


app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/auth",
    tags=["Auth"],
)


app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(router_products)

app.include_router(router_comments)

app.include_router(router_orders)

app.include_router(router_categories)