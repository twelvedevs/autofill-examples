"""Thin HTTP client for AutoFill via RapidAPI."""

from __future__ import annotations

import json
import mimetypes
from pathlib import Path
from typing import Any

import requests

CONNECT_TIMEOUT = 10
READ_TIMEOUT_RECOGNIZE = 120
READ_TIMEOUT_DEFAULT = 60


class AutofillAPIError(Exception):
    """Raised when the API returns HTTP >= 400."""

    def __init__(self, status_code: int, body: str):
        self.status_code = status_code
        self.body = body
        super().__init__(f"HTTP {status_code}: {body[:500]}")


class AutofillClient:
    def __init__(
        self,
        api_key: str,
        api_host: str,
        base_url: str,
        timeout: int = READ_TIMEOUT_RECOGNIZE,
    ):
        if not api_key or not api_host or not base_url:
            raise ValueError("api_key, api_host, and base_url are required")
        self.api_key = api_key
        self.api_host = api_host
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _headers(self, *, json_body: bool = False) -> dict[str, str]:
        headers = {
            "x-rapidapi-key": self.api_key,
            "x-rapidapi-host": self.api_host,
        }
        if json_body:
            headers["Content-Type"] = "application/json"
        return headers

    def _check(self, response: requests.Response) -> None:
        if response.status_code >= 400:
            raise AutofillAPIError(response.status_code, response.text)

    def upload(self, file_path: str | Path) -> dict[str, Any]:
        path = Path(file_path)
        if not path.is_file():
            raise FileNotFoundError(path)
        mime, _ = mimetypes.guess_type(path.name)
        mime = mime or "application/octet-stream"
        url = f"{self.base_url}/upload"
        with path.open("rb") as fh:
            response = requests.post(
                url,
                headers=self._headers(),
                files={"file": (path.name, fh, mime)},
                timeout=(CONNECT_TIMEOUT, READ_TIMEOUT_DEFAULT),
            )
        self._check(response)
        return response.json()

    def recognize(
        self,
        file_path: str,
        *,
        mode: str = "auto",
        fields: list[str] | None = None,
        language: str = "auto",
        use_cache: bool = True,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "filePath": file_path,
            "mode": mode,
            "language": language,
            "useCache": use_cache,
        }
        if fields is not None:
            payload["fields"] = fields
        url = f"{self.base_url}/recognize"
        response = requests.post(
            url,
            headers=self._headers(json_body=True),
            data=json.dumps(payload),
            timeout=(CONNECT_TIMEOUT, self.timeout),
        )
        self._check(response)
        return response.json()

    def ping(self) -> dict[str, Any]:
        url = f"{self.base_url}/ping"
        response = requests.get(
            url,
            headers=self._headers(),
            timeout=(CONNECT_TIMEOUT, READ_TIMEOUT_DEFAULT),
        )
        self._check(response)
        return response.json()


def fields_to_dataframe(result: dict[str, Any]):
    """Convert recognize response fields to a pandas DataFrame."""
    import pandas as pd

    fields = result.get("fields") or {}
    rows = []
    for name, entry in fields.items():
        if isinstance(entry, dict):
            rows.append(
                {
                    "field": name,
                    "value": entry.get("value"),
                    "confidence": entry.get("confidence"),
                }
            )
        else:
            rows.append({"field": name, "value": entry, "confidence": None})
    return pd.DataFrame(rows)
