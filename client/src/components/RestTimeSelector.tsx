import { useState } from "react";

const REST_OPTIONS = [
  { label: "Aucun minuteur", value: null },
  { label: "1:00", value: 60 },
  { label: "1:30", value: 90 },
  { label: "2:00", value: 120 },
  { label: "2:30", value: 150 },
  { label: "3:00", value: 180 },
] as const;

type RestTimeSelectorProps = {
  value: number | null;
  onChange: (restSeconds: number | null) => void;
  disabled?: boolean;
  editable?: boolean;
};

function formatRestTime(restSeconds: number | null) {
  if (restSeconds === null) {
    return "Aucun minuteur";
  }

  const minutes = Math.floor(restSeconds / 60);
  const seconds = String(restSeconds % 60).padStart(2, "0");

  return `Repos ${minutes}:${seconds}`;
}

function RestTimeSelector({
  value,
  onChange,
  disabled = false,
  editable = true,
}: RestTimeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formattedValue = formatRestTime(value);

  if (!editable) {
    return (
      <p className="mt-3 font-medium text-base-content/70 text-sm">
        {formattedValue}
      </p>
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        disabled={disabled}
        aria-expanded={isOpen}
        className="font-semibold text-primary text-sm transition hover:text-primary/75 disabled:cursor-wait disabled:opacity-50"
      >
        {formattedValue} · modifier
      </button>

      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Temps de repos">
          {REST_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              disabled={disabled}
              aria-pressed={value === option.value}
              className={`rounded-full border px-3 py-1.5 font-semibold text-xs transition disabled:cursor-wait disabled:opacity-50 ${
                value === option.value
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 bg-base-100 text-base-content hover:border-primary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestTimeSelector;
