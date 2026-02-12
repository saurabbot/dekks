from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.api import deps
from app.db import models
from app.db.session import get_db
from app.models import schemas
from app.core import security
from jose import jwt, JWTError
from app.core.config import settings
from app.services.email import email_service

router = APIRouter()

@router.post("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if user.is_email_verified:
        return {"message": "Email already verified", "already_verified": True}
    user.is_email_verified = True
    db.commit()
    db.refresh(user)
    
    db.query(models.Token).filter(
        models.Token.user_id == user.id,
        models.Token.token_type == "verification"
    ).delete()
    db.commit()
    
    return {"message": "Email verified successfully", "already_verified": False}

@router.post("/resend-verification-email")
async def resend_verification_email(current_user: models.User = Depends(deps.get_current_user), db: Session = Depends(get_db)):
    if current_user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    verification_token = security.create_verification_token(current_user.email)
    token = models.Token(
        user_id=current_user.id,
        token=verification_token,
        token_type="verification",
        expires_at=datetime.utcnow() + timedelta(minutes=settings.VERIFICATION_TOKEN_EXPIRE_MINUTES)
    )
    db.add(token)
    db.commit()
    db.refresh(token)
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    email_service.send_welcome_email(current_user.email, current_user.first_name, verification_url)
    return {"message": "Verification email sent"}