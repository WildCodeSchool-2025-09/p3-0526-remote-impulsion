import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useMessages } from "../contexts/MessageContext";
import authApi from "../services/authApi";

function Profile() {
  const { user, setUser } = useAuth();
  const { showMessage } = useMessages();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authApi.logoutUser();
      setUser(null);
      showMessage("Vous êtes déconnecté", "success");
      navigate("/login", { replace: true });
    } catch {
      showMessage("Impossible de se déconnecter", "error");
      setIsLoggingOut(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg">
        <header className="mb-6">
          <p className="mb-1 font-semibold text-primary text-sm uppercase tracking-wider">
            Ton espace Impulsion
          </p>
          <h1 className="font-display font-extrabold text-3xl uppercase italic">
            Profil
          </h1>
        </header>

        {user !== null && (
          <dl className="mb-6 flex flex-col gap-3">
            <div>
              <dt className="text-base-content/60 text-xs uppercase tracking-wider">
                Pseudonyme
              </dt>
              <dd className="font-semibold">{user.username}</dd>
            </div>
            <div>
              <dt className="text-base-content/60 text-xs uppercase tracking-wider">
                E-mail
              </dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
          </dl>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-lg border border-error/40 bg-error/10 px-4 py-3 font-bold text-error transition hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </section>
  );
}

export default Profile;
