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
      className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white"
      } ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
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
      <p className="font-medium text-slate-800">Drop a document or click to browse</p>
      <p className="mt-1 text-sm text-slate-500">PDF, PNG, JPEG — max 30 MB</p>
      <p className="mt-2 text-xs text-slate-400">
        Try{" "}
        <a
          className="text-indigo-600 underline"
          href="/samples/sample-invoice.pdf"
          download
          onClick={(e) => e.stopPropagation()}
        >
          sample-invoice.pdf
        </a>
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
