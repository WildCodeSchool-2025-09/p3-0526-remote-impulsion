import type { ReactNode } from "react";
import normalizeName from "../../utils/normalizeName";
import IconSvg from "./IconSvg";

const BODYWEIGHT = (
  <>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M5 10h14M12 6.5v5M9 20l3-8.5 3 8.5" />
  </>
);
const DUMBBELL = <path d="M4 9v6M7 7.5v9M17 7.5v9M20 9v6M7 12h10" />;
const BARBELL = <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />;
const CABLE = (
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 3v7M9 10h6M15 10v4" />
  </>
);
const MACHINE = (
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 4v6h8V4M8 20v-4h8v4" />
  </>
);
const CARDIO = (
  <>
    <circle cx="14" cy="4.5" r="1.8" />
    <path d="M13 8l-3 3 2 3 1 5M10 11L6 13M15 14l3 1 1 4" />
  </>
);
const FALLBACK = <circle cx="12" cy="12" r="8" />;

const ICONS: Record<string, ReactNode> = {
  "poids du corps": BODYWEIGHT,
  "poids de corps": BODYWEIGHT,
  halteres: DUMBBELL,
  haltere: DUMBBELL,
  barre: BARBELL,
  poulie: CABLE,
  cable: CABLE,
  machine: MACHINE,
  cardio: CARDIO,
};

type EquipmentIconProps = {
  name: string;
  isSelected: boolean;
};

function EquipmentIcon({ name, isSelected }: EquipmentIconProps) {
  return (
    <IconSvg
      className={`h-7 w-7 ${isSelected ? "text-primary" : "text-neutral"}`}
    >
      {ICONS[normalizeName(name)] ?? FALLBACK}
    </IconSvg>
  );
}

export default EquipmentIcon;
