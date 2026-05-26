export interface UploadResponse {
  filePath: string;
  mime?: string;
}

export interface FieldEntry {
  value?: string | number | boolean | null;
  confidence?: number;
}

export interface RecognizeResponse {
  fields?: Record<string, FieldEntry | string | number>;
  ocr?: unknown;
  meta?: {
    processingTime?: number;
    fromCache?: boolean;
    pageCount?: number;
    [key: string]: unknown;
  };
  error?: string | { en?: string; ru?: string; message?: string };
}

export type RecognizeMode = "auto" | "manual";

export interface TemplatePreset {
  id: string;
  name: string;
  presetKey: string;
  fields: string[];
}
