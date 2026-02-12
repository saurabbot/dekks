from dotenv import load_dotenv
import os
import requests
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime

load_dotenv()


@dataclass
class ApiResponse:
    success: bool
    data: Optional[Dict[str, Any]]
    error: Optional[str]
    status_code: int


class DataLasticService:
    def __init__(self):
        self.api_key = os.getenv("DATALASTIC_API_KEY")
        if not self.api_key:
            raise ValueError("DATALASTIC_API_KEY is not set")
        self.base_url = "https://api.datalastic.com/api/v0"
        self.headers = {
            "x-api-key": self.api_key,
        }

    def _request(self, endpoint: str, params: Optional[Dict[str, Any]] = None, method: str = "GET") -> ApiResponse:
        url = f"{self.base_url}/{endpoint}"
        try:
            if method == "GET":
                response = requests.get(url, headers=self.headers, params=params, timeout=30)
            elif method == "POST":
                response = requests.post(url, headers=self.headers, json=params, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            response.raise_for_status()
            data = response.json()

            if response.status_code == 200:
                return ApiResponse(success=True, data=data, error=None, status_code=response.status_code)
            else:
                return ApiResponse(
                    success=False,
                    data=None,
                    error=data.get("error", "Unknown error"),
                    status_code=response.status_code
                )
        except requests.exceptions.RequestException as e:
            return ApiResponse(
                success=False,
                data=None,
                error=f"Request failed: {str(e)}",
                status_code=getattr(e.response, 'status_code', 0)
            )

    def get_container_details(self, container_number: str) -> ApiResponse:
        params = {"container_number": container_number}
        return self._request("containers", params=params)

    def get_vessel_live(self, imo: Optional[str] = None, mmsi: Optional[str] = None) -> ApiResponse:
        params = {}
        if imo:
            params["imo"] = imo
        if mmsi:
            params["mmsi"] = mmsi
        if not params:
            return ApiResponse(success=False, data=None, error="IMO or MMSI required", status_code=0)
        return self._request("vessel", params=params)

    def get_vessels_bulk_live(self, identifiers: List[str]) -> ApiResponse:
        vessel_ids = ",".join(identifiers[:100])
        params = {"vessel_ids": vessel_ids}
        return self._request("vessel_bulk", params=params)

    def get_vessel_info(self, imo: str) -> ApiResponse:
        params = {"imo": imo}
        return self._request("vessel_info", params=params)

    def find_vessels(self, **filters: Any) -> ApiResponse:
        return self._request("vessel_find", params=filters)

    def find_ports(self, **filters: Any) -> ApiResponse:
        return self._request("port_find", params=filters)

    def get_vessels_in_radius(self, lat: float, lon: float, radius_km: int = 50, **filters: Any) -> ApiResponse:
        params = {"lat": lat, "lon": lon, "radius": radius_km, **filters}
        return self._request("vessel_inradius", params=params)

    def submit_historical_report(self, report_type: str, params: Dict[str, Any]) -> ApiResponse:
        payload = {"report": report_type, **params}
        return self._request("report", params=payload, method="POST")

    def check_report_status(self, report_id: str) -> ApiResponse:
        params = {"report_id": report_id}
        return self._request("report", params=params)

    def get_all_reports(self) -> ApiResponse:
        return self._request("report", params={"report_id": "_all"})

    def get_usage_stats(self) -> ApiResponse:
        return self._request("stat")

    def track_container_full(self, container_number: str) -> Dict[str, Any]:
        container_res = self.get_container_details(container_number)
        if not container_res.success:
            return {"error": container_res.error}

        vessel_imo = container_res.data.get("imo")
        if vessel_imo:
            vessel_res = self.get_vessel_live(imo=vessel_imo)
            return {
                "container": container_res.data,
                "vessel_live": vessel_res.data if vessel_res.success else None
            }
        return {"container": container_res.data, "vessel_live": None}

    def poll_report_until_ready(self, report_id: str, max_wait_minutes: int = 10, poll_interval: int = 30) -> ApiResponse:
        start_time = datetime.now()
        while (datetime.now() - start_time).total_seconds() / 60 < max_wait_minutes:
            status = self.check_report_status(report_id)
            if not status.success:
                return status

            report_status = status.data.get("status")
            if report_status == "DONE":
                return status
            elif report_status in ["FAILED", "ERROR"]:
                return ApiResponse(success=False, data=status.data, error="Report failed", status_code=0)

            time.sleep(poll_interval)

        return ApiResponse(success=False, data=None, error="Report timeout", status_code=0)


if __name__ == "__main__":
    service = DataLasticService()

    print("Container:", service.get_container_details("MEDU9091004"))
    print("Live vessel:", service.get_vessel_live(imo="9525338"))
    print("Usage:", service.get_usage_stats())
    print("Full tracking:", service.track_container_full("MEDU9091004"))
