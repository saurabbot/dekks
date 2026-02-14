from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.db.session import get_db
from app.models import schemas
from app.services.email import email_service
from app.core import security
from app.worker.tasks import send_email_verification_mail
from jose import jwt, JWTError
from app.core.config import settings
from datetime import datetime, timedelta


router = APIRouter()

@router.post("/register", response_model=schemas.User)
async def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = models.User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    verification_token = security.create_verification_token(user.email)
    token = models.Token(
        user_id=user.id,
        token=verification_token,
        token_type="verification",
        expires_at=datetime.utcnow() + timedelta(minutes=settings.VERIFICATION_TOKEN_EXPIRE_MINUTES)
    )
    db.add(token)
    db.commit()
    db.refresh(token)
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    html_content = email_service.get_welcome_mail_content(user.email, user.first_name, verification_url)
    send_email_verification_mail.delay(user.email, "🚢 Welcome to Dekks - Verify Your Account", html_content)
    return user

@router.post("/login", response_model=schemas.Token)
async def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if not user or not security.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return {
        "access_token": security.create_access_token(user.email),
        "refresh_token": security.create_refresh_token(user.email),
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(
            refresh_token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return {
        "access_token": security.create_access_token(user.email),
        "refresh_token": security.create_refresh_token(user.email),
        "token_type": "bearer",
    }

@router.get("/me", response_model=schemas.User)
async def get_current_user(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

@router.patch("/me", response_model=schemas.User)
async def update_user_me(
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    user_data = user_in.model_dump(exclude_unset=True)
    for field in user_data:
        setattr(current_user, field, user_data[field])
    
    db.commit()
    db.refresh(current_user)
    return current_user
