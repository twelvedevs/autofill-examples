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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Fields (manual)</span>
        <button
          type="button"
          className="text-sm text-indigo-600 hover:underline"
          onClick={() => onChange([...fields, ""])}
        >
          + Add field
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {fields.map((field, i) => (
          <li key={i} className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              value={field}
              placeholder="field name"
              onChange={(e) => update(i, e.target.value)}
            />
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-2 text-sm text-slate-600 hover:bg-slate-100"
              onClick={() => onChange(fields.filter((_, j) => j !== i))}
              aria-label="Remove field"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
