import { NavLink, Outlet } from "react-router";
import BarbellIcon from "../assets/icons/navigation/barbell.svg?react";
import CalendarIcon from "../assets/icons/navigation/calendar-month.svg?react";
import HistoryIcon from "../assets/icons/navigation/history.svg?react";
import HomeIcon from "../assets/icons/navigation/home.svg?react";
import PlayIcon from "../assets/icons/navigation/player-play.svg?react";
import ThemeIcon from "../assets/icons/navigation/theme.svg?react";
import UserIcon from "../assets/icons/navigation/user.svg?react";
import logoLight from "../assets/logo/logo-fond-clair.png";
import logoDark from "../assets/logo/logo-fond-sombre.png";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", icon: HomeIcon, end: true },
  { to: "/exercises", label: "Exercices", icon: BarbellIcon, end: false },
  { to: "/session", label: "Séance", icon: PlayIcon, end: false },
  { to: "/programs", label: "Programmes", icon: CalendarIcon, end: false },
  { to: "/history", label: "Historique", icon: HistoryIcon, end: false },
];

function Layout() {
  const [theme, setTheme] = useState<"impulsion-dark" | "impulsion-light">("impulsion-dark");

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "impulsion-dark"
        ? "impulsion-light"
        : "impulsion-dark",
    );
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content lg:flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 border-r border-base-300 p-4">
        <img
          src={theme === "impulsion-dark" ? logoDark : logoLight}
          alt="Impulsion"
          width={124}
          height={26}
          className="mb-8"
        />

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-field text-sm ${
                  isActive
                    ? "text-info font-semibold"
                    : "text-neutral hover:text-base-content"
                }`
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
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

      <main className="flex-1 p-4 pb-24 lg:pb-4">
        <Outlet />
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-base-200 border-t border-base-300 flex justify-around items-center">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold ${
                isActive ? "text-info" : "text-neutral"
              }`
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Layout;
