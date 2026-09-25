import { Link } from "react-router";

function Profile() {
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
          <p className="mt-2 text-base-content/70 text-sm">
            Connecte-toi pour retrouver tes séances et tes programmes.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-primary px-4 py-3 text-center font-bold text-primary-content transition hover:brightness-110"
          >
            Se connecter
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-base-300 bg-base-200 px-4 py-3 text-center font-semibold transition hover:border-primary hover:text-primary"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Profile;
