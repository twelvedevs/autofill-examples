# Python Quickstart — AutoFill on RapidAPI

Jupyter notebook (**Run All**) or CLI script using the same two-step API: `POST /upload` → `POST /recognize`.

Parent repo: [twelvedevs/autofill-examples](https://github.com/twelvedevs/autofill-examples)

## Prerequisites

- Python 3.10+
- [RapidAPI subscription](https://rapidapi.com/12devs-12devs-default/api/autofill/pricing)

## Setup

```bash
cd examples/python-quickstart
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:

```env
RAPIDAPI_KEY=your_key
RAPIDAPI_HOST=autofill.p.rapidapi.com
RAPIDAPI_BASE_URL=https://autofill.p.rapidapi.com
```

## CLI

```bash
python try_autofill.py --file samples/sample-invoice.pdf --mode auto
python try_autofill.py --file samples/sample-invoice.pdf --mode manual --preset commercial_invoice
```

Exit code `0` prints extracted `fields` as JSON; `1` on API or config errors.

## Notebook

```bash
jupyter notebook quickstart.ipynb
```

Run all cells: health check → auto recognize → manual Commercial Invoice preset → pandas table.

Committed notebook has **no outputs** (run locally with your key).

## Tests (mock HTTP, no API key needed)

```bash
pytest tests/ -q
```

## Field presets

`data/templates.json` mirrors the four Hub presets (BOL, Commercial Invoice, POD, Shipping Label). Sync from backend `templates.json` when templates change.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing `RAPIDAPI_KEY` | Copy `.env.example` → `.env` |
| HTTP 401 | Key/host must match the [Endpoints](https://rapidapi.com/12devs-12devs-default/api/autofill) tab |
| Timeout | Recognize can take up to **120 s** — wait or retry |
| Empty `fields` | Try `mode: manual` with a preset matching the document type |

## Related

- [React Try It](../react-tryit/) — browser UI (`VITE_RAPIDAPI_*` env names)
- [Live demo](https://autofill.12devs.info/)
