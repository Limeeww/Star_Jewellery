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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 focus:outline-none focus:ring-1 focus:ring-black rounded-none"
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
