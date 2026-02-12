from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, shipment, email
from app.websocket import manager

app = FastAPI(title="Dekks API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(email.router, prefix="/email", tags=["email"])
app.include_router(shipment.router, prefix="/shipments", tags=["shipments"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.websocket("/ws/track/{tracking_id}")
async def websocket_endpoint(websocket, tracking_id: str):
    await manager.connect(websocket, tracking_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"Echo: {data}", websocket)
    except Exception:
        manager.disconnect(websocket, tracking_id)
