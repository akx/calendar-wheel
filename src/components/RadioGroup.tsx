interface RadioGroupProps {
  options: string[];
  labels?: Record<string, string>;
  value: string | undefined;
  onChangeValue: (value: string) => void;
}

export function RadioGroup({
  options,
  labels,
  value,
  onChangeValue,
}: RadioGroupProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={() => onChangeValue(option)}
          />
          &nbsp;{labels?.[option] ?? option}
        </label>
      ))}
    </div>
  );
}
