import { useCallback, useState } from "react";
import { recognize, uploadFile } from "./api/autofillClient";
import BrandHeader from "./components/BrandHeader";
import FileDropzone from "./components/FileDropzone";
import FieldListEditor from "./components/FieldListEditor";
import RecognizeControls from "./components/RecognizeControls";
import ResultsPanel from "./components/ResultsPanel";
import TemplatePresetSelect from "./components/TemplatePresetSelect";
import { AUTO_PRESET_ID, TEMPLATE_PRESETS } from "./data/templates";
import type { RecognizeMode, RecognizeResponse } from "./types/autofill";

type UploadState = "idle" | "uploading" | "done" | "error";

export default function App() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [presetId, setPresetId] = useState(AUTO_PRESET_ID);
  const [mode, setMode] = useState<RecognizeMode>("auto");
  const [fields, setFields] = useState<string[]>([]);
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecognizeResponse | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  const applyPreset = useCallback((id: string) => {
    setPresetId(id);
    if (id === AUTO_PRESET_ID) {
      setMode("auto");
      setFields([]);
      return;
    }
    if (id === "custom") {
      setMode("manual");
      if (fields.length === 0) setFields(["invoice number"]);
      return;
    }
    const preset = TEMPLATE_PRESETS.find((p) => p.id === id);
    if (preset) {
      setMode("manual");
      setFields([...preset.fields]);
    }
  }, [fields.length]);

  const handleUpload = async (file: File) => {
    setUploadState("uploading");
    setUploadError(null);
    setFilePath(null);
    setResult(null);
    setExtractError(null);
    try {
      const res = await uploadFile(file);
      setFilePath(res.filePath);
      setUploadState("done");
    } catch (e) {
      setUploadState("error");
      setUploadError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleExtract = async () => {
    if (!filePath) return;
    const manualFields = fields.map((f) => f.trim()).filter(Boolean);
    if (mode === "manual" && manualFields.length === 0) {
      setExtractError("Add at least one field in manual mode.");
      return;
    }
    setLoading(true);
    setExtractError(null);
    setResult(null);
    try {
      const res = await recognize({
        filePath,
        mode,
        fields: mode === "manual" ? manualFields : undefined,
        language,
      });
      setResult(res);
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <BrandHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8">
          <section className="card-panel p-4 sm:p-5">
            <h2 className="section-label mb-3">1. Upload document</h2>
            <div className="relative">
              <FileDropzone disabled={uploadState === "uploading"} onFile={handleUpload} />
            </div>
            {uploadState === "uploading" && (
              <p className="mt-2 text-xs font-semibold text-amber-600">Uploading…</p>
            )}
            {filePath && (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-600">
                <span aria-hidden>✓</span> Ready:{" "}
                <code className="rounded bg-green-50 px-1.5 py-0.5 font-mono text-green-800">
                  {filePath}
                </code>
              </p>
            )}
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </section>

          <section className="card-panel space-y-4 p-4 sm:p-5">
            <h2 className="section-label">2. Configure extraction</h2>
            <TemplatePresetSelect value={presetId} onChange={applyPreset} />
            {mode === "manual" && (
              <FieldListEditor fields={fields} onChange={setFields} />
            )}
            <RecognizeControls
              mode={mode}
              language={language}
              filePath={filePath}
              loading={loading}
              onModeChange={(m) => {
                setMode(m);
                if (m === "auto") setPresetId(AUTO_PRESET_ID);
              }}
              onLanguageChange={setLanguage}
              onExtract={handleExtract}
            />
          </section>

          <section>
            <h2 className="section-label mb-3">3. Results</h2>
            <ResultsPanel result={result} error={extractError} />
          </section>
      </main>
    </div>
  );
}
