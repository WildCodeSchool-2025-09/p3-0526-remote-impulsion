import type { FunctionComponent, SVGProps } from "react";
import Arms from "../assets/icons/category/arms.svg?react";
import Back from "../assets/icons/category/back.svg?react";
import Cardio from "../assets/icons/category/cardio.svg?react";
import Chest from "../assets/icons/category/chest.svg?react";
import Core from "../assets/icons/category/core.svg?react";
import Legs from "../assets/icons/category/legs.svg?react";
import Shoulders from "../assets/icons/category/shoulders.svg?react";
import Stretching from "../assets/icons/category/stretching.svg?react";

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

const CATEGORY_ICONS: Record<string, IconComponent> = {
  arms: Arms,
  back: Back,
  cardio: Cardio,
  chest: Chest,
  core: Core,
  legs: Legs,
  shoulders: Shoulders,
  stretching: Stretching,
};

type CategoryIconProps = {
  id: string;
  className?: string;
};

function CategoryIcon({ id, className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[id];

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      className={className ? `category-icon ${className}` : "category-icon"}
      aria-hidden="true"
      focusable="false"
    />
  );
}

export default CategoryIcon;
