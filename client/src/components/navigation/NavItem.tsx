import type { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router";

type NavItemVariant = "desktop" | "mobile";

type NavItemProps = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
  variant: NavItemVariant;
};

const VARIANT_STYLES = {
  desktop: {
    base: "flex items-center gap-3 rounded-field px-3 py-2 text-sm",
    inactive: "text-neutral hover:text-base-content",
  },
  mobile: {
    base: "flex flex-col items-center gap-1 text-[10px] font-semibold",
    inactive: "text-neutral",
  },
} satisfies Record<NavItemVariant, { base: string; inactive: string }>;

function NavItem({ to, label, icon: Icon, end, variant }: NavItemProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${styles.base} ${
          isActive ? "font-semibold text-info" : styles.inactive
        }`
      }
    >
      <Icon className="size-5" />
      {label}
    </NavLink>
  );
}

export default NavItem;
