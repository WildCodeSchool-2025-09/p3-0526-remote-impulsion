import { createContext, useContext } from "react";

type MobileNavContextValue = {
  isNavOpen: boolean;
};

export const MobileNavContext = createContext<MobileNavContextValue>({
  isNavOpen: true,
});

export function useMobileNav() {
  return useContext(MobileNavContext);
}
