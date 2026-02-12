from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List] = {}

    async def connect(self, websocket, tracking_id: str):
        await websocket.accept()
        if tracking_id not in self.active_connections:
            self.active_connections[tracking_id] = []
        self.active_connections[tracking_id].append(websocket)

    def disconnect(self, websocket, tracking_id: str):
        self.active_connections[tracking_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket):
        await websocket.send_text(message)

manager = ConnectionManager()
