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
    <div className="flex flex-wrap items-end gap-4 border-t border-gray-200 pt-4">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-gray-700">Mode</span>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-gray-100/70 p-1">
          {(["auto", "manual"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              className={`rounded-md px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                mode === m
                  ? "border border-gray-200 bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </label>
      <label className="block min-w-[140px] flex-1">
        <span className="mb-1 block text-xs font-semibold text-gray-700">Language</span>
        <select
          className="input-field py-2"
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
        className="btn-primary min-w-[160px]"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3l1.8 4.7L19 9.5l-4.1 3 1.6 5-4.5-3.3-4.5 3.3 1.6-5-4.1-3 5.2-1.8L12 3z"
              />
            </svg>
            Extract Data
          </>
        )}
      </button>
      {loading && (
        <p className="w-full text-xs text-gray-500">Recognition may take up to 2 minutes.</p>
      )}
    </div>
  );
}
