#!/usr/bin/env python3
"""CLI quick start for AutoFill via RapidAPI."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from autofill_client import AutofillAPIError, AutofillClient

PRESET_DIR = Path(__file__).resolve().parent / "data" / "templates.json"


def load_presets() -> dict[str, list[str]]:
    data = json.loads(PRESET_DIR.read_text(encoding="utf-8"))
    return {item["presetKey"]: item["fields"] for item in data}


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        print(f"Missing {name}. Copy .env.example to .env and set your RapidAPI credentials.", file=sys.stderr)
        sys.exit(1)
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description="AutoFill RapidAPI CLI quick start")
    parser.add_argument("--file", required=True, help="Path to PDF/PNG/JPEG")
    parser.add_argument("--mode", choices=["auto", "manual"], default="auto")
    parser.add_argument(
        "--preset",
        choices=list(load_presets().keys()),
        help="Template preset (manual mode)",
    )
    parser.add_argument("--language", default="auto")
    args = parser.parse_args()

    load_dotenv()
    client = AutofillClient(
        api_key=require_env("RAPIDAPI_KEY"),
        api_host=require_env("RAPIDAPI_HOST"),
        base_url=require_env("RAPIDAPI_BASE_URL"),
    )

    fields: list[str] | None = None
    if args.mode == "manual":
        if not args.preset:
            print("--preset is required when --mode manual", file=sys.stderr)
            return 1
        fields = load_presets()[args.preset]

    try:
        uploaded = client.upload(args.file)
        result = client.recognize(
            uploaded["filePath"],
            mode=args.mode,
            fields=fields,
            language=args.language,
        )
    except AutofillAPIError as exc:
        print(exc, file=sys.stderr)
        return 1
    except FileNotFoundError as exc:
        print(exc, file=sys.stderr)
        return 1

    out = result.get("fields", result)
    print(json.dumps(out, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
