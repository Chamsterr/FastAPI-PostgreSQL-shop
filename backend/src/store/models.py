from datetime import datetime
from sqlalchemy import TIMESTAMP, Column, Integer, String, Float, LargeBinary, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from auth.models import User
from database import Base
from sqlalchemy import Enum
import enum
from sqlalchemy.orm import validates

class OrderStatus(enum.Enum):
    OPENED = "OPENED"
    CLOSED = "CLOSED"
    CANCELED = "CANCELED"


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    products = relationship("Product", back_populates="category")
    def __repr__(self):
        return self.name
    __table_args__ = (CheckConstraint('length(name)>0', name="category_name_gt_0"),)

class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    weight = Column(Float, CheckConstraint('weight>=0', name="product_weight_ge_0"))
    description = Column(Text, nullable=True)
    image = Column(LargeBinary)
    stock = Column(Integer, CheckConstraint('stock>=0', name="product_stock_ge_0"), nullable=False)
    price = Column(Float, CheckConstraint('price>0', name="product_price_gt_0"), nullable=False)
    category_id = Column(Integer, ForeignKey('category.id'))
    category = relationship("Category", back_populates="products")
    def __repr__(self):
        return self.name


class Order(Base):
    __tablename__ = "order"

    id = Column(Integer, primary_key=True)
    status = Column(Enum(OrderStatus))
    amount = Column(Integer, CheckConstraint('amount>0', name="order_amount_gt_0"), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow())
    user_id = Column(Integer, ForeignKey(User.id))

class Comment(Base):
    __tablename__ = "comment"

    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey(User.id))
    product_id = Column(Integer, ForeignKey('product.id'))


class OrderDetail(Base):
    __tablename__ = "order_detail"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("order.id"))
    product_id = Column(Integer, ForeignKey("product.id"))