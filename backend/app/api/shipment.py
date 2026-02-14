from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.db.session import get_db
from app.models import schemas
from app.services.jsoncargo import JsonCargoService
from app.services.datalastic import DataLasticService
import uuid

router = APIRouter()

@router.post("/", response_model=schemas.Shipment)
async def create_shipment(
    shipment_in: schemas.ShipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    existing_shipment = db.query(models.Shipment).filter(
        models.Shipment.container_id == shipment_in.container_id,
        models.Shipment.user_id == current_user.id
    ).first()
    
    if existing_shipment:
        raise HTTPException(
            status_code=400,
            detail="Shipment with this container ID already exists in your account."
        )
    
    shipment = models.Shipment(
        container_id=shipment_in.container_id,
        shipping_line_name=shipment_in.shipping_line.value,
        user_id=current_user.id,
        container_status="Pending"
    )
    
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment

@router.get("/", response_model=list[schemas.Shipment])
async def get_my_shipments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    return db.query(models.Shipment).filter(models.Shipment.user_id == current_user.id).all()

@router.get("/track_shipment_details")
async def track_shipment_details(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    shipment = db.query(models.Shipment).filter(
        models.Shipment.id == shipment_id, 
        models.Shipment.user_id == current_user.id
    ).first()
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    jsoncargo_service = JsonCargoService()
    try:
        # Fetch data from external API
        tracking_result = jsoncargo_service.track_shipment_details(
            shipment.container_id, 
            shipment.shipping_line_name, 
            shipment.shipping_line_id
        )
        
        # Optionally update the database with the new data
        if "data" in tracking_result:
            data = tracking_result["data"]
            shipment.container_status = data.get("container_status", shipment.container_status)
            shipment.last_location = data.get("last_location", shipment.last_location)
            shipment.last_location_terminal = data.get("last_location_terminal", shipment.last_location_terminal)
            shipment.next_location = data.get("next_location", shipment.next_location)
            shipment.next_location_terminal = data.get("next_location_terminal", shipment.next_location_terminal)
            shipment.current_vessel_name = data.get("current_vessel_name", shipment.current_vessel_name)
            shipment.current_voyage_number = data.get("current_voyage_number", shipment.current_voyage_number)
            db.commit()
            
        return tracking_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datalastic/container/{container_number}")
async def get_datalastic_container(
    container_number: str,
    current_user: models.User = Depends(deps.get_current_user)
):
    service = DataLasticService()
    result = service.get_container_details(container_number)
    if not result.success:
        raise HTTPException(status_code=result.status_code or 400, detail=result.error)
    return result.data

@router.get("/datalastic/vessel/live")
async def get_datalastic_vessel_live(
    imo: Optional[str] = None,
    mmsi: Optional[str] = None,
    current_user: models.User = Depends(deps.get_current_user)
):
    if not imo and not mmsi:
        raise HTTPException(status_code=400, detail="Either IMO or MMSI must be provided")
    service = DataLasticService()
    result = service.get_vessel_live(imo=imo, mmsi=mmsi)
    if not result.success:
        raise HTTPException(status_code=result.status_code or 400, detail=result.error)
    return result.data

@router.get("/datalastic/vessels/find")
async def find_datalastic_vessels(
    name: Optional[str] = None,
    flag: Optional[str] = None,
    current_user: models.User = Depends(deps.get_current_user)
):
    service = DataLasticService()
    params = {}
    if name: params["name"] = name
    if flag: params["flag"] = flag
    result = service.find_vessels(**params)
    if not result.success:
        raise HTTPException(status_code=result.status_code or 400, detail=result.error)
    return result.data

@router.post("/trigger-update")
async def trigger_update_all(
    current_user: models.User = Depends(deps.get_current_user)
):
    from app.worker.tasks import update_all_shipments
    update_all_shipments.delay()
    return {"message": "Update task triggered"}

@router.post("/{shipment_id}/share", response_model=schemas.Shipment)
async def share_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    shipment = db.query(models.Shipment).filter(
        models.Shipment.id == shipment_id,
        models.Shipment.user_id == current_user.id
    ).first()
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    if not shipment.share_token:
        shipment.share_token = str(uuid.uuid4())
    
    shipment.is_public = True
    db.commit()
    db.refresh(shipment)
    return shipment

@router.post("/{shipment_id}/unshare", response_model=schemas.Shipment)
async def unshare_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    shipment = db.query(models.Shipment).filter(
        models.Shipment.id == shipment_id,
        models.Shipment.user_id == current_user.id
    ).first()
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    shipment.is_public = False
    db.commit()
    db.refresh(shipment)
    return shipment

@router.get("/public/{share_token}", response_model=schemas.Shipment)
async def get_public_shipment(
    share_token: str,
    db: Session = Depends(get_db)
):
    shipment = db.query(models.Shipment).filter(
        models.Shipment.share_token == share_token,
        models.Shipment.is_public == True
    ).first()
    
    if not shipment:
        raise HTTPException(status_code=404, detail="Public shipment not found or sharing is disabled")
    
    return shipment

@router.get("/datalastic/ports/find")
async def find_datalastic_ports(
    name: Optional[str] = None,
    country: Optional[str] = None,
    current_user: models.User = Depends(deps.get_current_user)
):
    service = DataLasticService()
    params = {}
    if name: params["name"] = name
    if country: params["country"] = country
    result = service.find_ports(**params)
    if not result.success:
        raise HTTPException(status_code=result.status_code or 400, detail=result.error)
    return result.data
