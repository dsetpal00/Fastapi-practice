from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from .db import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)   # hash store hota hai, plain nahi


class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    task_date = Column(DateTime, default=datetime.now)
    due_date = Column(DateTime, nullable=False)
    status = Column(String, default="pending", nullable=False)
