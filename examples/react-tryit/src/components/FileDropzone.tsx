import { useCallback, useRef, useState } from "react";

const ACCEPT = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];
const MAX_BYTES = 30 * 1024 * 1024;

type Props = {
  disabled?: boolean;
  onFile: (file: File) => void;
};

export default function FileDropzone({ disabled, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!ACCEPT.includes(file.type)) {
      return "Use PDF, PNG, or JPEG.";
    }
    if (file.size > MAX_BYTES) {
      return "File exceeds 30 MB limit.";
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const msg = validate(file);
      if (msg) {
        setError(msg);
        return;
      }
      setError(null);
      onFile(file);
    },
    [onFile],
  );

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 transition-all sm:gap-4 sm:p-4 ${
        dragOver ? "border-indigo-400 shadow-lg" : "hover:border-indigo-300 hover:shadow-lg"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md sm:h-12 sm:w-12">
        <svg
          className="h-5 w-5 text-white sm:h-6 sm:w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-gray-900 sm:text-sm">
          Select file or drop here
        </div>
        <p className="mt-0.5 text-xs font-medium text-gray-600">pdf, jpg, png — max 30 MB</p>
        <p className="mt-1 text-xs text-gray-500">
          Sample:{" "}
          <a
            className="font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
            href="/samples/sample-invoice.pdf"
            download
            onClick={(e) => e.stopPropagation()}
          >
            sample-invoice.pdf
          </a>
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="ml-auto flex-shrink-0 whitespace-nowrap rounded-lg bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-200 hover:text-indigo-800 sm:px-4 sm:text-sm"
      >
        {disabled ? "Uploading…" : "Browse"}
      </button>
      {error && (
        <p className="absolute left-4 right-4 top-full mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
