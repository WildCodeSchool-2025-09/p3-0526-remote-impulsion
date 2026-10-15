import BarbellIcon from "../../assets/icons/equipment/barbell.svg?react";
import BodyweightIcon from "../../assets/icons/equipment/bodyweight.svg?react";
import CableIcon from "../../assets/icons/equipment/cable.svg?react";
import CardioIcon from "../../assets/icons/equipment/cardio.svg?react";
import DumbbellIcon from "../../assets/icons/equipment/dumbbell.svg?react";
import MachineIcon from "../../assets/icons/equipment/machine.svg?react";
import normalizeName from "../../utils/normalizeName";

type IconComponent = typeof BarbellIcon;

const ICONS: Record<string, IconComponent> = {
  "poids du corps": BodyweightIcon,
  "poids de corps": BodyweightIcon,
  halteres: DumbbellIcon,
  haltere: DumbbellIcon,
  barre: BarbellIcon,
  poulie: CableIcon,
  cable: CableIcon,
  machine: MachineIcon,
  cardio: CardioIcon,
};

type EquipmentIconProps = {
  name: string;
  isSelected: boolean;
};

function EquipmentIcon({ name, isSelected }: EquipmentIconProps) {
  const Icon = ICONS[normalizeName(name)];

  if (Icon === undefined) {
    return <div className="h-7 w-7" />;
  }

  return (
    <Icon
      aria-hidden="true"
      className={`h-7 w-7 ${isSelected ? "text-primary" : "text-neutral"}`}
    />
  );
}

export default EquipmentIcon;
