import type { ReactNode } from "react";

type IconSvgProps = {
  className: string;
  children: ReactNode;
};

function IconSvg({ className, children }: IconSvgProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export default IconSvg;
