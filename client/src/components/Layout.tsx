import { NavLink, Outlet } from "react-router";
import { Home, Dumbbell, PlayCircle, Calendar, Clock, Zap } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", icon: Home, end: true },
  { to: "/exercises", label: "Exercices", icon: Dumbbell, end: false },
  { to: "/session", label: "Séance", icon: PlayCircle, end: false },
  { to: "/programs", label: "Programmes", icon: Calendar, end: false },
  { to: "/history", label: "Historique", icon: Clock, end: false },
];

function Layout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content lg:flex">
      {/* Rail latéral — desktop uniquement */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 border-r border-base-300 p-4">
        <div className="flex items-center gap-2 mb-8">
          <Zap size={19} className="text-primary" />
          <span className="font-display italic font-extrabold uppercase text-lg">
            Impulsion
          </span>
        </div>

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
              <Icon size={19} strokeWidth={1.6} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenu de la page */}
      <main className="flex-1 p-4 pb-24 lg:pb-4">
        <Outlet />
      </main>

      {/* Barre basse — mobile uniquement */}
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
            <Icon size={19} strokeWidth={1.6} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Layout;