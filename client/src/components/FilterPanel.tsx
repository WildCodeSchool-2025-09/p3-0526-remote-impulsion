import type { ReferenceItem } from "../types/filters";

type FilterPanelProps = {
  label: string;
  options: ReferenceItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled: boolean;
};

function FilterPanel({
  label,
  options,
  selectedId,
  onSelect,
  isOpen,
  onToggle,
  disabled,
}: FilterPanelProps) {
  const selectedName = options.find((option) => option.id === selectedId)?.name;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="btn btn-outline btn-sm"
      >
        {selectedName ?? label}
      </button>
      {isOpen && !disabled && (
        <ul className="menu absolute z-10 mt-1 w-max min-w-full rounded-box border border-base-300 bg-base-100 p-2 shadow">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className={option.id === selectedId ? "active" : ""}
                onClick={() => {
                  onSelect(option.id === selectedId ? null : option.id);
                  onToggle();
                }}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterPanel;
