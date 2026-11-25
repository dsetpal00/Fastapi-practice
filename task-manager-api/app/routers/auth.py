from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import schemas, models, oauth2
from ..db import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/login", response_model=schemas.Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form.username mein email aata hai
    user = db.query(models.User).filter(models.User.email == form.username).first()

    if not user or not oauth2.verify_password(form.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = oauth2.create_access_token({"sub": str(user.user_id)})

    return {"access_token": token, "token_type": "bearer"}
