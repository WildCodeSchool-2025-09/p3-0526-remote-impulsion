import ArmsIcon from "../../assets/icons/category/arms.svg?react";
import BackIcon from "../../assets/icons/category/back.svg?react";
import CardioIcon from "../../assets/icons/category/cardio.svg?react";
import ChestIcon from "../../assets/icons/category/chest.svg?react";
import CoreIcon from "../../assets/icons/category/core.svg?react";
import LegsIcon from "../../assets/icons/category/legs.svg?react";
import ShouldersIcon from "../../assets/icons/category/shoulders.svg?react";
import StretchingIcon from "../../assets/icons/category/stretching.svg?react";
import normalizeName from "../../utils/normalizeName";

type IconComponent = typeof ArmsIcon;

const ICONS: Record<string, IconComponent> = {
  pectoraux: ChestIcon,
  dos: BackIcon,
  epaules: ShouldersIcon,
  bras: ArmsIcon,
  abdominaux: CoreIcon,
  abdos: CoreIcon,
  jambes: LegsIcon,
  cardio: CardioIcon,
  etirements: StretchingIcon,
  etirement: StretchingIcon,
};

type CategoryIconProps = {
  name: string;
  isSelected: boolean;
};

function CategoryIcon({ name, isSelected }: CategoryIconProps) {
  const Icon = ICONS[normalizeName(name)];

  if (Icon === undefined) {
    return <div className="h-[72px]" />;
  }

  return (
    <Icon
      aria-hidden="true"
      className={`h-[72px] w-auto ${
        isSelected
          ? "[&_.base]:fill-base-content/60 [&_.zone]:fill-primary"
          : "[&_.base]:fill-base-300 [&_.zone]:fill-primary/40"
      }`}
    />
  );
}

export default CategoryIcon;
