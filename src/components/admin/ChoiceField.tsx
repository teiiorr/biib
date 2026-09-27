export interface ChoiceOption<V extends string> {
  readonly value: V;
  readonly label: string;
  readonly hint: string;
}

interface ChoiceFieldProps<V extends string> {
  readonly id: string;
  readonly legend: string;
  readonly value: V;
  readonly options: readonly ChoiceOption<V>[];
  readonly onChange: (value: V) => void;
}

/** Bir nechta variantdan bittasi: tabiiy radio tugmalar, har birining ostida bir qatorli izoh. */
export function ChoiceField<V extends string>({
  id,
  legend,
  value,
  options,
  onChange,
}: ChoiceFieldProps<V>) {
  return (
    <fieldset className="admin-choice">
      <legend className="t-label text-ink">{legend}</legend>
      <div className="admin-choice-list">
        {options.map((option) => {
          const hintId = `${id}-${option.value}-hint`;
          return (
            <label key={option.value} className="admin-radio">
              <input
                type="radio"
                name={id}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                aria-describedby={hintId}
              />
              <span className="admin-radio-text t-body text-ink">
                {option.label}
                <span id={hintId} className="t-small text-ink-3">
                  {option.hint}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
