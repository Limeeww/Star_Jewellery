interface SelectVariantFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  disabled?: boolean;
}

export default function SelectVariantField({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: SelectVariantFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
