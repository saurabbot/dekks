from celery import shared_task
from app.db.session import SessionLocal
from app.db import models
from app.services.jsoncargo import JsonCargoService
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
        
        for shipment in shipments:
            try:
                if shipment.updated_at is None or shipment.updated_at < datetime.utcnow() - timedelta(minutes=30):
                    continue
                logger.info(f"Updating shipment: {shipment.container_id}")
                tracking_result = jsoncargo_service.track_shipment_details(
                    shipment.container_id, 
                    shipment.shipping_line_name, 
                    shipment.shipping_line_id
                )
                
                if "data" in tracking_result:
                    data = tracking_result["data"]
                    shipment.container_status = data.get("container_status", shipment.container_status)
                    shipment.last_location = data.get("last_location", shipment.last_location)
                    shipment.last_location_terminal = data.get("last_location_terminal", shipment.last_location_terminal)
                    shipment.next_location = data.get("next_location", shipment.next_location)
                    shipment.next_location_terminal = data.get("next_location_terminal", shipment.next_location_terminal)
                    shipment.current_vessel_name = data.get("current_vessel_name", shipment.current_vessel_name)
                    shipment.current_voyage_number = data.get("current_voyage_number", shipment.current_voyage_number)
                    shipment.updated_at = datetime.utcnow()
                    db.commit()
            except Exception as e:
                logger.error(f"Failed to update shipment {shipment.container_id}: {str(e)}")
                db.rollback()
                
    finally:
        db.close()

@shared_task
def send_notification_email(recipient_email: str, subject: str, html_content: str):
    email_service.send_email(recipient_email, subject, html_content)
