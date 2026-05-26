import type { RecognizeMode } from "../types/autofill";

type Props = {
  mode: RecognizeMode;
  language: string;
  filePath: string | null;
  loading: boolean;
  onModeChange: (mode: RecognizeMode) => void;
  onLanguageChange: (lang: string) => void;
  onExtract: () => void;
};

const LANGUAGES = [
  { value: "auto", label: "Auto" },
  { value: "eng", label: "English" },
  { value: "rus+eng", label: "Russian + English" },
  { value: "nld", label: "Dutch" },
  { value: "deu", label: "German" },
  { value: "fra", label: "French" },
];

export default function RecognizeControls({
  mode,
  language,
  filePath,
  loading,
  onModeChange,
  onLanguageChange,
  onExtract,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Mode</span>
        <select
          className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as RecognizeMode)}
        >
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Language</span>
        <select
          className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={!filePath || loading}
        onClick={onExtract}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Extracting… (up to 2 min)" : "Extract fields"}
      </button>
    </div>
  );
}
