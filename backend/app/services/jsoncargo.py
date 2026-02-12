from dotenv import load_dotenv
import os
import requests

load_dotenv()

class JsonCargoService:
    def __init__(self):
        self.api_key = os.getenv("JSONCARGO_API_KEY")
        if not self.api_key:
            raise ValueError("JSONCARGO_API_KEY is not set")
        self.base_url = "https://api.jsoncargo.com/api/v1"
        self.headers = {
            "x-api-key": self.api_key,
        }

    def track_shipment_details(self, container_number: str, shipping_line_name: str, shipping_line_id: str = None):
        url = f"{self.base_url}/containers/{container_number}?shipping_line={shipping_line_name}"
        if shipping_line_id:
            url += f"&shipping_line_id={shipping_line_id}"
        response = requests.get(url, headers=self.headers)
        return response.json()
