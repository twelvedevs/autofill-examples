import { AUTO_PRESET_ID, TEMPLATE_PRESETS } from "../data/templates";

type Props = {
  value: string;
  onChange: (presetId: string) => void;
};

export default function TemplatePresetSelect({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">Template preset</span>
      <select
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value={AUTO_PRESET_ID}>Auto (no preset)</option>
        {TEMPLATE_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
        <option value="custom">Custom fields</option>
      </select>
    </label>
  );
}
