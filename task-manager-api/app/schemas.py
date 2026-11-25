from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr

TaskStatus = Literal["pending", "completed", "expired"]


# ---------- Users ----------
class CreateUser(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int            # model mein Integer hai, isliye yahan int (str nahi)
    email: EmailStr

    model_config = {"from_attributes": True}


# ---------- Tasks ----------
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None     # optional, frontend khali bhej sakta hai
    due_date: datetime


class TaskUpdate(BaseModel):              # sab optional: jo bheja wahi update hoga
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[TaskStatus] = None


class TaskResponse(BaseModel):
    task_id: int                          # frontend ko id chahiye (edit/delete ke liye)
    title: str
    description: Optional[str] = None
    due_date: datetime
    status: str

    model_config = {"from_attributes": True}


# ---------- Auth ----------
class Token(BaseModel):
    access_token: str
    token_type: str
