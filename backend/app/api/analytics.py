from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.db import models
from app.db.session import get_db
from app.models import schemas
from datetime import datetime
from collections import defaultdict

router = APIRouter()

@router.get("/carriers")
async def get_carrier_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Only show analytics for current user's shipments
    shipments = db.query(models.Shipment).filter(
        models.Shipment.user_id == current_user.id
    ).all()
    
    carrier_stats = defaultdict(lambda: {
        "total_shipments": 0,
        "on_time_shipments": 0,
        "total_delay_hours": 0,
        "delayed_shipments": 0
    })
    
    for s in shipments:
        line = s.shipping_line_name or "Unknown"
        stats = carrier_stats[line]
        stats["total_shipments"] += 1
        
        if s.eta_final_destination and s.ata_final_destination:
            delay = (s.ata_final_destination - s.eta_final_destination).total_seconds() / 3600
            if delay > 0:
                stats["total_delay_hours"] += delay
                stats["delayed_shipments"] += 1
            
            if delay <= 24: # Realiability threshold: 24h
                stats["on_time_shipments"] += 1
        elif s.container_status == "Delivered":
            # If no ATA/ETA but delivered, assume on time for now or skip
            stats["on_time_shipments"] += 1

    formatted_stats = []
    for line, stats in carrier_stats.items():
        reliability = (stats["on_time_shipments"] / stats["total_shipments"] * 100) if stats["total_shipments"] > 0 else 0
        avg_delay = (stats["total_delay_hours"] / stats["delayed_shipments"]) if stats["delayed_shipments"] > 0 else 0
        
        formatted_stats.append({
            "carrier": line.replace('_', ' '),
            "reliability_score": round(reliability, 1),
            "avg_delay_hours": round(avg_delay, 1),
            "total_volume": stats["total_shipments"]
        })
    
    return sorted(formatted_stats, key=lambda x: x["reliability_score"], reverse=True)
