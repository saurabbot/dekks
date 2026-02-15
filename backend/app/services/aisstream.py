import asyncio
import websockets
import json
import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class AISStreamService:
    def __init__(self):
        self.api_key = os.getenv("AISSTREAM_API_KEY")
        self.url = "wss://stream.aisstream.io/v0/stream"

    async def _fetch_vessel_async(self, mmsi: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            logger.error("AISSTREAM_API_KEY not set")
            return None

        try:
            async with websockets.connect(self.url) as websocket:
                subscribe_msg = {
                    "APIKey": self.api_key,
                    "BoundingBoxes": [[[-90, -180], [90, 180]]], # Global bounding box
                    "FiltersShipMMSI": [str(mmsi)],
                    "FilterMessageTypes": ["PositionReport"]
                }
                
                await websocket.send(json.dumps(subscribe_msg))

                # Wait for the first matching message with a timeout
                try:
                    # We'll wait for up to 10 seconds for a position report
                    while True:
                        msg = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                        data = json.loads(msg)
                        
                        if data.get("MessageType") == "PositionReport":
                            vessel_data = data.get("MetaData", {})
                            # PositionReport field is inside Message
                            message = data.get("Message", {}).get("PositionReport", {})
                            
                            return {
                                "lat": message.get("Latitude"),
                                "lon": message.get("Longitude"),
                                "speed": message.get("Sog"),
                                "course": message.get("Cog"),
                                "mmsi": vessel_data.get("MMSI"),
                                "vessel_name": vessel_data.get("ShipName"),
                                "source": "aisstream.io"
                            }
                except asyncio.TimeoutError:
                    logger.warning(f"AISStream timeout for MMSI: {mmsi}")
                    return None
        except Exception as e:
            logger.error(f"AISStream connection error: {str(e)}")
            return None

    def get_vessel_position(self, mmsi: str) -> Optional[Dict[str, Any]]:
        """
        Synchronous wrapper to fetch vessel position from AISStream.io
        """
        if not mmsi:
            return None
            
        try:
            # Create a new event loop for this thread if one doesn't exist
            # This is safer in Celery workers which might use different concurrency models
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(self._fetch_vessel_async(mmsi))
            loop.close()
            return result
        except Exception as e:
            logger.error(f"Failed to run AISStream async: {str(e)}")
            return None

if __name__ == "__main__":
    # Test script
    import sys
    test_mmsi = sys.argv[1] if len(sys.argv) > 1 else "244670249"
    service = AISStreamService()
    print(f"Fetching position for MMSI {test_mmsi}...")
    pos = service.get_vessel_position(test_mmsi)
    print(f"Result: {pos}")
