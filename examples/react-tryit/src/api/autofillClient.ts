import type { RecognizeMode, RecognizeResponse, UploadResponse } from "../types/autofill";

const RECOGNIZE_TIMEOUT_MS = 120_000;
const UPLOAD_TIMEOUT_MS = 60_000;

function getConfig() {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY?.trim();
  const apiHost = import.meta.env.VITE_RAPIDAPI_HOST?.trim();
  const baseUrl = import.meta.env.VITE_RAPIDAPI_BASE_URL?.trim().replace(/\/$/, "");

  if (!apiKey || !apiHost || !baseUrl) {
    throw new Error(
      "Missing VITE_RAPIDAPI_KEY, VITE_RAPIDAPI_HOST, or VITE_RAPIDAPI_BASE_URL. Copy .env.example to .env.",
    );
  }

  return { apiKey, apiHost, baseUrl };
}

function rapidHeaders(json = false): HeadersInit {
  const { apiKey, apiHost } = getConfig();
  const headers: Record<string, string> = {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiHost,
  };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const err = data?.error;
    if (typeof err === "string") return err;
    if (err?.en) return err.en;
    if (err?.ru) return err.ru;
    if (err?.message) return err.message;
    return JSON.stringify(data);
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const { baseUrl } = getConfig();
  const form = new FormData();
  form.append("file", file);

  const response = await fetchWithTimeout(
    `${baseUrl}/upload`,
    { method: "POST", headers: rapidHeaders(), body: form },
    UPLOAD_TIMEOUT_MS,
  );

  if (response.status === 401) {
    throw new Error("401 Unauthorized — check VITE_RAPIDAPI_KEY and VITE_RAPIDAPI_HOST.");
  }
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export interface RecognizeParams {
  filePath: string;
  mode: RecognizeMode;
  fields?: string[];
  language?: string;
  useCache?: boolean;
}

export async function recognize(params: RecognizeParams): Promise<RecognizeResponse> {
  const { baseUrl } = getConfig();
  const body: Record<string, unknown> = {
    filePath: params.filePath,
    mode: params.mode,
    language: params.language ?? "auto",
    useCache: params.useCache ?? true,
  };
  if (params.fields?.length) body.fields = params.fields;

  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${baseUrl}/recognize`,
      {
        method: "POST",
        headers: rapidHeaders(true),
        body: JSON.stringify(body),
      },
      RECOGNIZE_TIMEOUT_MS,
    );
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Request timed out after 120s. Large PDFs may need a retry.");
    }
    throw e;
  }

  if (response.status === 401) {
    throw new Error("401 Unauthorized — check VITE_RAPIDAPI_KEY and VITE_RAPIDAPI_HOST.");
  }
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}
