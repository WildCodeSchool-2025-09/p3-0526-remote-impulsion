type EquipmentIconProps = {
  name: string;
  isSelected: boolean;
};

function normalize(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function EquipmentIcon({ name, isSelected }: EquipmentIconProps) {
  const key = normalize(name);
  const className = `h-7 w-7 ${isSelected ? "text-primary" : "text-neutral"}`;
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  if (key.includes("poids") || key.includes("corps")) {
    return (
      <svg {...common}>
        <circle cx="12" cy="4.5" r="2" />
        <path d="M5 10h14M12 6.5v5M9 20l3-8.5 3 8.5" />
      </svg>
    );
  }

  if (key.includes("haltere")) {
    return (
      <svg {...common}>
        <path d="M4 9v6M7 7.5v9M17 7.5v9M20 9v6M7 12h10" />
      </svg>
    );
  }

  if (key.includes("barre")) {
    return (
      <svg {...common}>
        <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />
      </svg>
    );
  }

  if (key.includes("poulie") || key.includes("cable")) {
    return (
      <svg {...common}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 3v7M9 10h6M15 10v4" />
      </svg>
    );
  }

  if (key.includes("machine")) {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 4v6h8V4M8 20v-4h8v4" />
      </svg>
    );
  }

  if (key.includes("cardio") || key.includes("tapis")) {
    return (
      <svg {...common}>
        <circle cx="14" cy="4.5" r="1.8" />
        <path d="M13 8l-3 3 2 3 1 5M10 11L6 13M15 14l3 1 1 4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export default EquipmentIcon;
