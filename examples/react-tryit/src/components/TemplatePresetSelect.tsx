import { AUTO_PRESET_ID, TEMPLATE_PRESETS } from "../data/templates";

type Props = {
  value: string;
  onChange: (presetId: string) => void;
};

export default function TemplatePresetSelect({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="section-label">Template preset</span>
      <select className="input-field mt-2" value={value} onChange={(e) => onChange(e.target.value)}>
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
