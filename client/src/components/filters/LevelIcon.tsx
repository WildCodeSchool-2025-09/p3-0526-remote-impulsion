import normalizeName from "../../utils/normalizeName";

type LevelIconProps = {
  name: string;
  isSelected: boolean;
};

function boltCount(name: string) {
  const key = normalizeName(name);

  if (key.includes("avance") || key.includes("confirme")) {
    return 3;
  }
  if (key.includes("intermediaire")) {
    return 2;
  }
  return 1;
}

function LevelIcon({ name, isSelected }: LevelIconProps) {
  const total = boltCount(name);

  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map((index) => (
        <svg
          key={index}
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-5 w-5 ${
            index < total
              ? isSelected
                ? "fill-primary"
                : "fill-neutral"
              : "fill-base-300"
          }`}
        >
          <path d="M13.5 2L4 14h6l-1.5 8L19 10h-6l.5-8z" />
        </svg>
      ))}
    </span>
  );
}

export default LevelIcon;
