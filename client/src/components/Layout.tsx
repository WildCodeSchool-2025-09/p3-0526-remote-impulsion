import { type PointerEvent, useState } from "react";
import { NavLink, Outlet, useMatch } from "react-router";
import ChevronDownIcon from "../assets/icons/chevrons/chevron-down.svg?react";
import ChevronUpIcon from "../assets/icons/chevrons/chevron-up.svg?react";
import BarbellIcon from "../assets/icons/navigation/barbell.svg?react";
import CalendarIcon from "../assets/icons/navigation/calendar-month.svg?react";
import HistoryIcon from "../assets/icons/navigation/history.svg?react";
import HomeIcon from "../assets/icons/navigation/home.svg?react";
import PlayIcon from "../assets/icons/navigation/player-play.svg?react";
import ThemeIcon from "../assets/icons/navigation/theme.svg?react";
import UserIcon from "../assets/icons/navigation/user.svg?react";
import logoLight from "../assets/logo/logo-fond-clair.png";
import logoDark from "../assets/logo/logo-fond-sombre.png";
import { MobileNavContext } from "../contexts/MobileNavContext";
import useTheme from "../hooks/useTheme";
import MessageBanner from "./feedback/MessageBanner";
import NavItem from "./navigation/NavItem";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", icon: HomeIcon, end: true },
  { to: "/exercises", label: "Exercices", icon: BarbellIcon, end: false },
  { to: "/sessions", label: "Séances", icon: PlayIcon, end: false },
  { to: "/programs", label: "Programmes", icon: CalendarIcon, end: false },
  { to: "/history", label: "Historique", icon: HistoryIcon, end: false },
];

function Layout() {
  const { theme, toggleTheme } = useTheme();

  const isSessionDetail = useMatch("/sessions/:id") !== null;
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setIsNavOpen(true);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setIsNavOpen(false);
    }
  };

  const isNavVisible = !isSessionDetail || isNavOpen;

  return (
    <MobileNavContext.Provider value={{ isNavOpen: isNavVisible }}>
      <div className="min-h-screen bg-base-100 text-base-content lg:flex">
        <MessageBanner />
        <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 border-r border-base-300 p-4">
          <img
            src={theme === "impulsion-dark" ? logoDark : logoLight}
            alt="Impulsion"
            width={124}
            height={26}
            className="mb-8"
          />

          <nav
            aria-label="Navigation principale"
            className="flex flex-col gap-1"
          >
            {NAV_ITEMS.map(({ to, label, icon, end }) => (
              <NavItem
                key={to}
                to={to}
                label={label}
                icon={icon}
                end={end}
                variant="desktop"
              />
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-1 border-base-300 border-t pt-4">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-field px-3 py-2 text-left text-neutral text-sm transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
              onClick={toggleTheme}
            >
              <ThemeIcon className="size-5" />
              <span>Thème</span>
            </button>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-field px-3 py-2 text-sm transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 ${
                  isActive
                    ? "font-semibold text-info"
                    : "text-neutral hover:text-base-content"
                }`
              }
            >
              <UserIcon className="size-5" />
              <span>Profil</span>
            </NavLink>
          </div>
        </aside>

        {!isSessionDetail && (
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-base-300 border-b bg-base-100/95 px-4 backdrop-blur lg:hidden">
            <img
              src={theme === "impulsion-dark" ? logoDark : logoLight}
              alt="Impulsion"
              width={112}
              height={24}
            />

            <NavLink
              to="/profile"
              aria-label="Ouvrir le profil"
              className={({ isActive }) =>
                `grid size-10 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2 ${
                  isActive
                    ? "border-info bg-info text-info-content"
                    : "border-base-300 bg-base-200 text-base-content hover:border-info hover:text-info"
                }`
              }
            >
              <UserIcon className="size-5" />
              <span className="sr-only">Profil</span>
            </NavLink>
          </header>
        )}

        <main
          className={`flex-1 p-4 pb-24 lg:pt-4 lg:pb-4 ${
            isSessionDetail ? "pt-6" : ""
          }`}
        >
          <Outlet />
        </main>

        <div
          onPointerEnter={isSessionDetail ? handlePointerEnter : undefined}
          onPointerLeave={isSessionDetail ? handlePointerLeave : undefined}
          className={`fixed right-0 bottom-0 left-0 z-10 transition-transform duration-300 lg:hidden ${
            isNavVisible ? "translate-y-0" : "translate-y-20"
          }`}
        >
          {isSessionDetail && (
            <button
              type="button"
              onClick={() => setIsNavOpen((wasOpen) => !wasOpen)}
              aria-expanded={isNavOpen}
              aria-label={
                isNavOpen ? "Masquer la navigation" : "Afficher la navigation"
              }
              className="mx-auto flex h-7 w-20 items-center justify-center rounded-t-2xl bg-base-200 text-neutral transition-colors hover:text-base-content focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2"
            >
              {isNavOpen ? (
                <ChevronDownIcon aria-hidden="true" className="size-4" />
              ) : (
                <ChevronUpIcon aria-hidden="true" className="size-4" />
              )}
            </button>
          )}

          <nav
            aria-label="Navigation mobile"
            className="flex h-20 items-center justify-around border-base-300 border-t bg-base-200"
          >
            {NAV_ITEMS.map(({ to, label, icon, end }) => (
              <NavItem
                key={to}
                to={to}
                label={label}
                icon={icon}
                end={end}
                variant="mobile"
              />
            ))}
          </nav>
        </div>
      </div>
    </MobileNavContext.Provider>
  );
}

export default Layout;
