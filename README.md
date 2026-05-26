# Autofill API — Quick-start examples

Runnable examples for [**AutoFill on RapidAPI**](https://rapidapi.com/12devs-12devs-default/api/autofill): upload a document, extract fields with OCR + LLM, view results in a UI or notebook.

Live product demo: [autofill.12devs.info](https://autofill.12devs.info/)

## RapidAPI gateway (production)

Use these values from the **Endpoints** tab of your subscription (they match the Hub cURL):

| Variable | Value |
|----------|--------|
| **Base URL** (`RAPIDAPI_BASE_URL` / `VITE_RAPIDAPI_BASE_URL`) | `https://autofill.p.rapidapi.com` |
| **Host** (`RAPIDAPI_HOST` / `VITE_RAPIDAPI_HOST`) | `autofill.p.rapidapi.com` |
| **Key** | Your `X-RapidAPI-Key` from the Hub |

Env name mapping: React uses `VITE_RAPIDAPI_*`; Python uses `RAPIDAPI_*`. Same gateway, different prefixes.

**Typical flow:** `POST /upload` (multipart field `file`) → `POST /recognize` with `{ "filePath": "…", "mode": "auto" }`. Allow up to **120 seconds** on recognize.

## Quick starts

| Example | Path | What you get |
|---------|------|----------------|
| **React Try It** | [`examples/react-tryit`](examples/react-tryit/) | Vite + React UI — drag-and-drop sample PDF, Auto or Manual preset, table + JSON |
| **Python Quickstart** | [`examples/python-quickstart`](examples/python-quickstart/) | Jupyter **Run All** or `python try_autofill.py` — same API, optional pandas table |

## Shared assets

- Sample PDF: `examples/python-quickstart/samples/sample-invoice.pdf` (also in React `public/samples/`) — anonymized Dutch VAT invoice scenario, &lt; 5 MB.
- Field presets (BOL, Commercial Invoice, POD, Shipping Label): [`shared/data/templates.json`](shared/data/templates.json). When backend templates change, sync manually from `custom_document_recognition/backend/templates/templates.json`.

## Docs

- [RapidAPI Hub glossary & cURL](docs/RAPIDAPI_HUB_README.md)
- [OpenAPI spec](swagger.yaml) (copy of the listing contract)

## Subscribe

1. [Subscribe on RapidAPI](https://rapidapi.com/12devs-12devs-default/api/autofill/pricing)
2. Copy **X-RapidAPI-Key** and **X-RapidAPI-Host** from **Endpoints**
3. Pick an example folder above and follow its README (~5 minutes to first extracted fields)

## License

MIT — see [LICENSE](LICENSE).
