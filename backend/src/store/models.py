from datetime import datetime
from sqlalchemy import CheckConstraint, Float, LargeBinary, Table, Column, Integer, String, TIMESTAMP, ForeignKey, MetaData, Text
from sqlalchemy import MetaData

from auth.models import user

metadata = MetaData()

category = Table(
    "category",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), nullable=False, unique=True, index=True),
    Column("image", LargeBinary, nullable=False),
    CheckConstraint('length(name)>0', name="category_name_gt_0")
)

product = Table(
    "product",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), unique=True, nullable=False),
    Column("weight", Float, CheckConstraint('weight>=0', name="product_weight_ge_0")),
    Column("description", Text, nullable=True),
    Column("image", LargeBinary),
    Column("stock", Integer, CheckConstraint('stock>=0', name="product_stock_ge_0"), nullable=False),
    Column("price", Float, CheckConstraint('price>0', name="product_price_gt_0"), nullable=False),
    Column("category_id", Integer, ForeignKey('category.id'))
)

order = Table(
    "order",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("status", String, default="OPENED"),
    Column("amount", Integer, CheckConstraint('amount>0', name="order_amount_gt_0"), nullable=False),
    Column("created_at", TIMESTAMP, default=datetime.utcnow()),
    Column("user_id", Integer, ForeignKey(user.c.id))
)

comment = Table(
    "comment",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("text", Text, nullable=False),
    Column("user_id", Integer, ForeignKey(user.c.id)),
    Column("product_id", Integer, ForeignKey('product.id'))
)

order_detail = Table(
    "order_detail",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("order_id", Integer, ForeignKey("order.id")),
    Column("product_id", Integer, ForeignKey("product.id"))
)