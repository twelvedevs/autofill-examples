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
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card-panel flex h-40 items-center justify-center">
        <p className="text-sm text-gray-500">Upload a file and click Extract Data to see results.</p>
      </div>
    );
  }

  return (
    <div className="card-panel flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 text-xs">
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 font-semibold transition-colors ${
              tab === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
            onClick={() => setTab("table")}
          >
            Table
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 font-semibold transition-colors ${
              tab === "json" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
            onClick={() => setTab("json")}
          >
            JSON
          </button>
        </div>
        <button
          type="button"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={copyJson}
        >
          Copy JSON
        </button>
      </div>
      {result.meta && (
        <div className="border-b border-gray-100 bg-gradient-to-r from-red-50/80 to-white px-4 py-2 text-xs text-gray-600">
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
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-2 font-medium">Field</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-gray-500">
                    No fields returned (try auto mode or another preset).
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.field} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs font-medium text-gray-800">{r.field}</td>
                    <td className="px-4 py-2 text-gray-900">{r.value || "—"}</td>
                    <td className="px-4 py-2">
                      {r.confidence !== "—" ? (
                        <span className="inline-flex items-center rounded-md border border-amber-100/80 bg-amber-50 px-2 py-0.5 font-mono text-xs font-semibold text-amber-900">
                          {r.confidence}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700/60 bg-slate-900 p-4 m-3 shadow-inner">
          <pre className="max-h-96 overflow-auto text-xs leading-relaxed text-slate-100 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
