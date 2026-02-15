from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum

class ShippingLine(str, Enum):
    MAERSK = "MAERSK"
    HAPAG_LLOYD = "HAPAG_LLOYD"
    HMM = "HMM"
    ONE = "ONE"
    EVERGREEN = "EVERGREEN"
    MSC = "MSC"
    CMA_CGM = "CMA_CGM"
    COSCO = "COSCO"
    ZIM = "ZIM"
    YANG_MING = "YANG_MING"

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_email_verified: bool
    notify_on_arrival: bool = True
    notify_on_departure: bool = True
    notify_on_delay: bool = True
    notify_via_email: bool = True
    notify_via_whatsapp: bool = False
    whatsapp_number: Optional[str] = None
    created_at: datetime
    
    @field_validator("notify_on_arrival", "notify_on_departure", "notify_on_delay", "notify_via_email", mode="before")
    @classmethod
    def default_true_if_none(cls, v):
        return v if v is not None else True

    @field_validator("notify_via_whatsapp", mode="before")
    @classmethod
    def default_false_if_none(cls, v):
        return v if v is not None else False

    class Config:
        from_attributes = True

class ShipmentBase(BaseModel):
    container_id: str
    shipping_line_id: Optional[str] = None
    shipping_line_name: Optional[ShippingLine] = None

class ShipmentCreate(BaseModel):
    container_id: str
    shipping_line: ShippingLine
    final_destination: Optional[str] = None
    final_destination_port: Optional[str] = None
    final_destination_eta: Optional[datetime] = None

class Shipment(ShipmentBase):
    id: int
    user_id: int
    container_type: Optional[str] = None
    container_status: Optional[str] = None
    tare: Optional[str] = None
    final_destination: Optional[str] = None
    final_destination_port: Optional[str] = None
    final_destination_eta: Optional[datetime] = None
    shipped_from: Optional[str] = None
    shipped_from_terminal: Optional[str] = None
    shipped_to: Optional[str] = None
    shipped_to_terminal: Optional[str] = None
    atd_origin: Optional[datetime] = None
    eta_final_destination: Optional[datetime] = None
    ata_final_destination: Optional[datetime] = None
    last_location: Optional[str] = None
    last_location_terminal: Optional[str] = None
    next_location: Optional[str] = None
    next_location_terminal: Optional[str] = None
    atd_last_location: Optional[datetime] = None
    eta_next_destination: Optional[datetime] = None
    timestamp_of_last_location: Optional[datetime] = None
    last_movement_timestamp: Optional[datetime] = None
    loading_port: Optional[str] = None
    discharging_port: Optional[str] = None
    last_vessel_name: Optional[str] = None
    last_voyage_number: Optional[str] = None
    current_vessel_name: Optional[str] = None
    current_voyage_number: Optional[str] = None
    vessel_lat: Optional[float] = None
    vessel_lon: Optional[float] = None
    vessel_speed: Optional[float] = None
    vessel_course: Optional[float] = None
    last_updated_at: Optional[datetime] = None
    share_token: Optional[str] = None
    is_public: bool = False
    co2_emissions: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    @field_validator("is_public", mode="before")
    @classmethod
    def default_false_if_none(cls, v):
        return v if v is not None else False

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    sub: Optional[str] = None

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str
    shipment_id: int

class Notification(NotificationBase):
    id: int
    user_id: int
    is_read: bool = False
    created_at: datetime

    @field_validator("is_read", mode="before")
    @classmethod
    def default_is_read_false_if_none(cls, v):
        return v if v is not None else False

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    notify_on_arrival: Optional[bool] = None
    notify_on_departure: Optional[bool] = None
    notify_on_delay: Optional[bool] = None
    notify_via_email: Optional[bool] = None
    notify_via_whatsapp: Optional[bool] = None
    whatsapp_number: Optional[str] = None
