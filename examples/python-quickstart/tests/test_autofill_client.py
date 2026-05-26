"""Unit tests for AutofillClient (mocked HTTP)."""

import json
from pathlib import Path

import responses

from autofill_client import AutofillAPIError, AutofillClient

BASE = "https://autofill.p.rapidapi.com"
CLIENT = AutofillClient("test-key", "autofill.p.rapidapi.com", BASE)


@responses.activate
def test_upload_success(tmp_path: Path):
    sample = tmp_path / "doc.pdf"
    sample.write_bytes(b"%PDF-1.4 test")
    responses.add(
        responses.POST,
        f"{BASE}/upload",
        json={"filePath": "123-doc.pdf", "mime": "application/pdf"},
        status=200,
    )
    result = CLIENT.upload(sample)
    assert result["filePath"] == "123-doc.pdf"
    assert len(responses.calls) == 1
    assert "x-rapidapi-key" in responses.calls[0].request.headers


@responses.activate
def test_recognize_auto_success():
    responses.add(
        responses.POST,
        f"{BASE}/recognize",
        json={"fields": {"invoice number": {"value": "INV-1", "confidence": 0.9}}},
        status=200,
    )
    result = CLIENT.recognize("123-doc.pdf", mode="auto")
    body = json.loads(responses.calls[0].request.body)
    assert body["filePath"] == "123-doc.pdf"
    assert body["mode"] == "auto"
    assert result["fields"]["invoice number"]["value"] == "INV-1"


@responses.activate
def test_unauthorized_401():
    responses.add(
        responses.POST,
        f"{BASE}/recognize",
        body='{"error":{"en":"Unauthorized"}}',
        status=401,
    )
    try:
        CLIENT.recognize("x.pdf")
        assert False, "expected AutofillAPIError"
    except AutofillAPIError as exc:
        assert exc.status_code == 401
