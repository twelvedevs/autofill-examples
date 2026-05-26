import { useMemo, useState } from "react";
import type { RecognizeResponse } from "../types/autofill";

type Row = { field: string; value: string; confidence: string };

function formatConfidence(c?: number): string {
  if (c == null || Number.isNaN(c)) return "—";
  return `${Math.round(c * 100)}%`;
}

function extractRows(result: RecognizeResponse | null): Row[] {
  if (!result?.fields) return [];
  return Object.entries(result.fields).map(([field, entry]) => {
    if (entry && typeof entry === "object" && "value" in entry) {
      return {
        field,
        value: entry.value != null ? String(entry.value) : "",
        confidence: formatConfidence(entry.confidence),
      };
    }
    return {
      field,
      value: entry != null ? String(entry) : "",
      confidence: "—",
    };
  });
}

type Props = {
  result: RecognizeResponse | null;
  error: string | null;
};

export default function ResultsPanel({ result, error }: Props) {
  const [tab, setTab] = useState<"table" | "json">("table");
  const rows = useMemo(() => extractRows(result), [result]);

  const copyJson = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <p className="text-sm text-slate-500">Upload a file and click Extract to see results.</p>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded px-3 py-1 text-sm ${tab === "table" ? "bg-indigo-100 text-indigo-800" : "text-slate-600"}`}
            onClick={() => setTab("table")}
          >
            Table
          </button>
          <button
            type="button"
            className={`rounded px-3 py-1 text-sm ${tab === "json" ? "bg-indigo-100 text-indigo-800" : "text-slate-600"}`}
            onClick={() => setTab("json")}
          >
            JSON
          </button>
        </div>
        <button
          type="button"
          className="text-sm text-indigo-600 hover:underline"
          onClick={copyJson}
        >
          Copy JSON
        </button>
      </div>
      {result.meta && (
        <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
          {result.meta.processingTime != null && (
            <span className="mr-4">processing: {result.meta.processingTime} ms</span>
          )}
          {result.meta.fromCache != null && (
            <span className="mr-4">cache: {String(result.meta.fromCache)}</span>
          )}
          {result.meta.pageCount != null && <span>pages: {result.meta.pageCount}</span>}
        </div>
      )}
      {tab === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-2 font-medium">Field</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-slate-500">
                    No fields returned (try auto mode or another preset).
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.field} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-mono text-xs">{r.field}</td>
                    <td className="px-4 py-2">{r.value || "—"}</td>
                    <td className="px-4 py-2">{r.confidence}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <pre className="max-h-96 overflow-auto p-4 text-xs text-slate-800">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
