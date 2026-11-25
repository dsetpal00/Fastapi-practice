from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models, schemas, oauth2
from ..db import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def create_user(user: schemas.CreateUser, db: Session = Depends(get_db)):
    new_user = models.User(email=user.email, password=oauth2.hash_password(user.password))

    # duplicate email wala case handle
    try:
        db.add(new_user)
        db.commit()
    except IntegrityError:
        db.rollback()                      # roll_back nahi, rollback
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    db.refresh(new_user)
    return new_user


# Frontend login ke baad isi se email dikhata hai
@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(oauth2.get_current_user)):
    return current_user


@router.get("/", response_model=list[schemas.UserResponse])
def all_users(db: Session = Depends(get_db),
              current_user: models.User = Depends(oauth2.get_current_user)):
    return db.query(models.User).all()


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(db: Session = Depends(get_db),
              current_user: models.User = Depends(oauth2.get_current_user)):
    db.delete(current_user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
