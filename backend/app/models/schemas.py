from pydantic import BaseModel, EmailStr
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
    created_at: datetime
    
    class Config:
        from_attributes = True

class ShipmentBase(BaseModel):
    container_id: str
    shipping_line_id: Optional[str] = None
    shipping_line_name: Optional[ShippingLine] = None

class ShipmentCreate(BaseModel):
    container_id: str
    shipping_line: ShippingLine

class Shipment(ShipmentBase):
    id: int
    user_id: int
    container_type: Optional[str] = None
    container_status: Optional[str] = None
    tare: Optional[str] = None
    shipped_from: Optional[str] = None
    shipped_from_terminal: Optional[str] = None
    shipped_to: Optional[str] = None
    shipped_to_terminal: Optional[str] = None
    atd_origin: Optional[datetime] = None
    eta_final_destination: Optional[datetime] = None
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
    last_updated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    sub: Optional[str] = None
