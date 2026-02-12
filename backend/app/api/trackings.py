from fastapi import APIRouter, Depends
from typing import List
from app.models import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Tracking])
async def get_trackings():
    return []

@router.post("/", response_model=schemas.Tracking)
async def create_tracking(tracking: schemas.TrackingCreate):
    return {**tracking.model_dump(), "id": 1, "created_at": "2026-01-28T00:00:00"}
