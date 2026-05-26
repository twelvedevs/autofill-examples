# React Try It — AutoFill on RapidAPI

Minimal Vite + React + TypeScript UI: upload a document → **Auto** or **Manual** preset → view extracted fields as a table or JSON.

Parent repo: [twelvedevs/autofill-examples](https://github.com/twelvedevs/autofill-examples)

## Prerequisites

- Node.js 18+
- [RapidAPI subscription](https://rapidapi.com/12devs-12devs-default/api/autofill/pricing)

## Setup

```bash
cd examples/react-tryit
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_RAPIDAPI_KEY=your_key
VITE_RAPIDAPI_HOST=autofill.p.rapidapi.com
VITE_RAPIDAPI_BASE_URL=https://autofill.p.rapidapi.com
```

## Run

```bash
npm run dev
```

Open http://localhost:5173 — upload `public/samples/sample-invoice.pdf` or drag your own PDF/PNG/JPEG.

## Features

- **Auto mode** — `mode: "auto"` (default, fastest first result)
- **Manual presets** — Bill of Lading, Commercial Invoice, Proof of Delivery, Shipping Label
- **Custom fields** — edit the field list before Extract
- **120 s timeout** on recognize (spinner text warns up to 2 minutes)
- **401 / API errors** — surfaced in the results panel

## Build

```bash
npm run build
npm run preview
```

## Env mapping

| React (Vite) | Python example |
|--------------|----------------|
| `VITE_RAPIDAPI_KEY` | `RAPIDAPI_KEY` |
| `VITE_RAPIDAPI_HOST` | `RAPIDAPI_HOST` |
| `VITE_RAPIDAPI_BASE_URL` | `RAPIDAPI_BASE_URL` |

## Related

- [Python Quickstart](../python-quickstart/)
- [Live demo](https://autofill.12devs.info/)
