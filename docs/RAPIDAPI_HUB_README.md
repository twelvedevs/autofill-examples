# RapidAPI Hub — AutoFill glossary

Listing: [AutoFill API](https://rapidapi.com/12devs-12devs-default/api/autofill)

## Headers (every request)

| Header | Source |
|--------|--------|
| `x-rapidapi-key` | Subscription key from **Endpoints** |
| `x-rapidapi-host` | `autofill.p.rapidapi.com` (from Hub cURL) |

## Base URL

```
https://autofill.p.rapidapi.com
```

No trailing slash. Paths are root-relative: `/upload`, `/recognize`, `/ping`.

## Two-step quick start

### 1. Upload

```bash
curl --request POST \
  --url 'https://autofill.p.rapidapi.com/upload' \
  --header 'x-rapidapi-key: YOUR_KEY' \
  --header 'x-rapidapi-host: autofill.p.rapidapi.com' \
  --form 'file=@samples/sample-invoice.pdf'
```

Response: `{ "filePath": "…", "mime": "application/pdf" }`

### 2. Recognize

```bash
curl --request POST \
  --url 'https://autofill.p.rapidapi.com/recognize' \
  --header 'x-rapidapi-key: YOUR_KEY' \
  --header 'x-rapidapi-host: autofill.p.rapidapi.com' \
  --header 'Content-Type: application/json' \
  --data '{"filePath":"PASTE_FILE_PATH","mode":"auto","language":"auto","useCache":true}'
```

Allow **120 s** client timeout on recognize.

## Modes

- **`auto`** — server expands/suggests fields (fastest first success).
- **`manual`** — only the `fields` array you send (use presets from [shared/data/templates.json](../shared/data/templates.json)).

## Examples repo

| Stack | Folder |
|-------|--------|
| React UI | [examples/react-tryit](../examples/react-tryit/) |
| Python notebook / CLI | [examples/python-quickstart](../examples/python-quickstart/) |

## Errors

- **401** — check key and host match the listing.
- **429** — rate limit; retry after cooldown.
- Body may include `error.en` / `error.ru` for human-readable messages.
