import type { ReactNode } from "react";
import type { ReferenceItem } from "../../types/filters";

type FilterGridProps = {
  legend: string;
  showLegend?: boolean;
  options: ReferenceItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  disabled: boolean;
  columnsClassName: string;
  renderIcon: (option: ReferenceItem, isSelected: boolean) => ReactNode;
};

function FilterGrid({
  legend,
  showLegend = false,
  options,
  selectedId,
  onSelect,
  disabled,
  columnsClassName,
  renderIcon,
}: FilterGridProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend
        className={
          showLegend
            ? "mb-2 font-bold text-[11px] text-neutral uppercase tracking-[0.2em]"
            : "sr-only"
        }
      >
        {legend}
      </legend>

      <div className={`grid gap-2 ${columnsClassName}`}>
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected ? null : option.id)}
              className={`flex flex-col items-center justify-end gap-1.5 rounded-xl border-2 px-1.5 py-2.5 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-base-300 bg-base-100 hover:border-neutral"
              }`}
            >
              {renderIcon(option, isSelected)}
              <span
                className={`text-center font-medium text-[10px] leading-tight ${
                  isSelected ? "text-base-content/80" : "text-neutral"
                }`}
              >
                {option.name}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default FilterGrid;
