from celery import shared_task
from app.db.session import SessionLocal
from app.db import models
from app.services.jsoncargo import JsonCargoService
from app.services.datalastic import DataLasticService
from app.services.email import email_service
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@shared_task
def update_all_shipments():
    db = SessionLocal()
    try:
        shipments = db.query(models.Shipment).all()
        jsoncargo_service = JsonCargoService()
        datalastic_service = DataLasticService()
        
        for shipment in shipments:
            try:
                if shipment.updated_at is not None and shipment.updated_at > datetime.utcnow() - timedelta(minutes=30):
                    logger.info(f"Skipping recently updated shipment: {shipment.container_id}")
                    continue
                logger.info(f"Updating shipment: {shipment.container_id}")
                tracking_result = jsoncargo_service.track_shipment_details(
                    shipment.container_id, 
                    shipment.shipping_line_name, 
                    shipment.shipping_line_id
                )
                
                if "data" in tracking_result:
                    data = tracking_result["data"]
                    new_status = data.get("container_status")
                    old_status = shipment.container_status
                    
                    # Update shipment fields
                    shipment.container_status = new_status or shipment.container_status
                    shipment.last_location = data.get("last_location", shipment.last_location)
                    shipment.last_location_terminal = data.get("last_location_terminal", shipment.last_location_terminal)
                    shipment.next_location = data.get("next_location", shipment.next_location)
                    shipment.next_location_terminal = data.get("next_location_terminal", shipment.next_location_terminal)
                    shipment.current_vessel_name = data.get("current_vessel_name", shipment.current_vessel_name)
                    shipment.current_voyage_number = data.get("current_voyage_number", shipment.current_voyage_number)
                    shipment.updated_at = datetime.utcnow()

                    # Fetch Live AIS data if IMO found
                    vessel_imo = data.get("imo")
                    if vessel_imo:
                        vessel_res = datalastic_service.get_vessel_live(imo=vessel_imo)
                        if vessel_res.success and vessel_res.data:
                            v_data = vessel_res.data.get("vessel", {})
                            shipment.vessel_lat = v_data.get("lat")
                            shipment.vessel_lon = v_data.get("lon")
                            shipment.vessel_speed = v_data.get("speed")
                            shipment.vessel_course = v_data.get("course")
                    
                    # Log History
                    history_record = models.ShipmentHistory(
                        shipment_id=shipment.id,
                        last_location=shipment.last_location,
                        last_location_terminal=shipment.last_location_terminal,
                        next_location=shipment.next_location,
                        next_location_terminal=shipment.next_location_terminal,
                        current_vessel_name=shipment.current_vessel_name,
                        current_voyage_number=shipment.current_voyage_number,
                        vessel_lat=shipment.vessel_lat,
                        vessel_lon=shipment.vessel_lon,
                        vessel_speed=shipment.vessel_speed,
                        last_updated_at=shipment.updated_at,
                        last_movement_timestamp=shipment.last_movement_timestamp
                    )
                    db.add(history_record)
                    
                    # Estimate CO2 Emissions (kg)
                    # 15g per km per TEU (standard ocean freight)
                    # We estimate 5000km if distance is unknown, 
                    # or more if we had coordinates (Haversine placeholder for now)
                    if not shipment.co2_emissions:
                        distance_km = 5000 # Default average distance
                        if data.get("shipped_from") and data.get("shipped_to"):
                            # Simple logic for distance estimation based on route length
                            # In real app, we'd use lat/lon or a distance table
                            pass
                        
                        teu_factor = 1.0 # Assume 1 TEU per shipment for now
                        emissions_kg = (distance_km * 15 * teu_factor) / 1000
                        shipment.co2_emissions = emissions_kg
                    
                    # Detect Changes and Notify
                    if new_status and new_status != old_status:
                        logger.info(f"Status change detected for {shipment.container_id}: {old_status} -> {new_status}")
                        
                        # Create In-app Notification
                        notification = models.Notification(
                            user_id=shipment.user_id,
                            shipment_id=shipment.id,
                            title=f"Shipment Update: {shipment.container_id}",
                            message=f"Status changed from {old_status} to {new_status}",
                            type="STATUS_CHANGE"
                        )
                        db.add(notification)
                        
                        # Trigger Email Alert if enabled
                        user = shipment.user
                        if user and user.notify_via_email:
                            email_service.send_shipment_update(
                                user.email, 
                                shipment.container_id, 
                                new_status
                            )
                    
                    db.commit()
            except Exception as e:
                logger.error(f"Failed to update shipment {shipment.container_id}: {str(e)}")
                db.rollback()
                
    finally:
        db.close()

@shared_task
def send_notification_email(recipient_email: str, subject: str, html_content: str):
    email_service.send_email(recipient_email, subject, html_content)


@shared_task
def send_email_verification_mail(recipient_email: str, subject: str, html_content: str):
    email_service.send_email(recipient_email, subject, html_content)
