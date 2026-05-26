type Props = {
  fields: string[];
  onChange: (fields: string[]) => void;
};

export default function FieldListEditor({ fields, onChange }: Props) {
  const update = (index: number, value: string) => {
    const next = [...fields];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-surface-muted p-4">
      <div className="flex items-center justify-between">
        <span className="section-label">Target fields (manual)</span>
        <button
          type="button"
          className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
          onClick={() => onChange([...fields, ""])}
        >
          + Add field
        </button>
      </div>
      <ul className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {fields.length === 0 ? (
          <li className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
            No fields yet. Add a field or choose a template preset.
          </li>
        ) : (
          fields.map((field, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5 transition-colors hover:border-gray-300"
            >
              <input
                className="flex-1 border-0 bg-transparent p-0 text-sm font-medium text-gray-800 focus:outline-none focus:ring-0"
                value={field}
                placeholder="field name"
                onChange={(e) => update(i, e.target.value)}
              />
              <button
                type="button"
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                onClick={() => onChange(fields.filter((_, j) => j !== i))}
                aria-label="Remove field"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
