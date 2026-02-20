from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    is_email_verified = Column(Boolean, default=False)
    
    # Notification Preferences
    notify_on_arrival = Column(Boolean, default=True)
    notify_on_departure = Column(Boolean, default=True)
    notify_on_delay = Column(Boolean, default=True)
    notify_via_email = Column(Boolean, default=True)
    notify_via_whatsapp = Column(Boolean, default=False)
    whatsapp_number = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    shipments = relationship("Shipment", back_populates="user")
    tokens = relationship("Token", back_populates="user", cascade="all, delete-orphan")

class Shipment(Base):
    __tablename__  = "shipments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    container_id = Column(String, index=True, nullable=False)
    container_type = Column(String, nullable=True)
    container_status = Column(String, nullable=True)
    shipping_line_name = Column(String, nullable=True)
    shipping_line_id = Column(String, nullable=True)
    final_destination = Column(String, nullable=True)
    final_destination_port = Column(String, nullable=True)
    final_destination_eta = Column(DateTime, nullable=True)
    tare = Column(String, nullable=True)
    
    shipped_from = Column(String, nullable=True)
    shipped_from_terminal = Column(String, nullable=True)
    shipped_to = Column(String, nullable=True)
    shipped_to_terminal = Column(String, nullable=True)
    
    atd_origin = Column(DateTime, nullable=True)
    eta_final_destination = Column(DateTime, nullable=True)
    ata_final_destination = Column(DateTime, nullable=True)
    
    last_location = Column(String, nullable=True)
    last_location_terminal = Column(String, nullable=True)
    next_location = Column(String, nullable=True)
    next_location_terminal = Column(String, nullable=True)
    
    atd_last_location = Column(DateTime, nullable=True)
    eta_next_destination = Column(DateTime, nullable=True)
    timestamp_of_last_location = Column(DateTime, nullable=True)
    last_movement_timestamp = Column(DateTime, nullable=True)
    
    loading_port = Column(String, nullable=True)
    discharging_port = Column(String, nullable=True)
    
    last_vessel_name = Column(String, nullable=True)
    last_voyage_number = Column(String, nullable=True)
    current_vessel_name = Column(String, nullable=True)
    current_voyage_number = Column(String, nullable=True)
    
    vessel_lat = Column(Float, nullable=True)
    vessel_lon = Column(Float, nullable=True)
    vessel_speed = Column(Float, nullable=True)
    vessel_course = Column(Float, nullable=True)
    
    last_updated_at = Column(DateTime, nullable=True)
    
    share_token = Column(String, unique=True, index=True, nullable=True)
    is_public = Column(Boolean, default=False)
    co2_emissions = Column(Float, nullable=True)

    order_date = Column(String, nullable=True)
    item_code = Column(String, nullable=True)
    item_name = Column(String, nullable=True)
    coo = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    buyer_name = Column(String, nullable=True)
    ref_no = Column(String, nullable=True)
    doc_status = Column(String, nullable=True)

    user = relationship("User", back_populates="shipments")
    history = relationship("ShipmentHistory", back_populates="shipment", cascade="all, delete-orphan")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ShipmentHistory(Base):
    __tablename__ = "shipment_history"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    last_location = Column(String, nullable=True)
    last_location_terminal = Column(String, nullable=True)
    next_location = Column(String, nullable=True)
    next_location_terminal = Column(String, nullable=True)
    current_vessel_name = Column(String, nullable=True)
    current_voyage_number = Column(String, nullable=True)
    vessel_lat = Column(Float, nullable=True)
    vessel_lon = Column(Float, nullable=True)
    vessel_speed = Column(Float, nullable=True)
    last_updated_at = Column(DateTime, nullable=True)
    last_movement_timestamp = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="history")

class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String, nullable=False)
    token_type = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="tokens")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False) # e.g., 'ARRIVAL', 'DEPARTURE', 'DELAY'
    is_read = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    shipment = relationship("Shipment")