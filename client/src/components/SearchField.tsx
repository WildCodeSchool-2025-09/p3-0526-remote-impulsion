type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

function SearchField({ value, onChange, disabled }: SearchFieldProps) {
  return (
    <div className="join">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un exercice"
        disabled={disabled}
        className="input input-bordered join-item"
      />
      {value !== "" && (
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="btn join-item"
          aria-label="Effacer la recherche"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchField;
