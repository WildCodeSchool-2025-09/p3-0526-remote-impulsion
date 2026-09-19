import { useState } from "react";
import authApi from "../services/authApi";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setIsSuccess(false);

    try {
      const result = await authApi.registerUser({ username, email, password });

      if (result.success) {
        setUsername("");
        setEmail("");
        setPassword("");
        setIsSuccess(true);
        return;
      }

      setErrors(result.errors);
    } catch {
      setErrors({ global: "Impossible de contacter le serveur." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-h-full bg-[#0F172A] px-4 py-8 text-[#F8FAFC]">
      <h1 className="mb-6 font-display text-3xl font-extrabold italic uppercase">
        Créer un compte
      </h1>

      {isSuccess && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300"
        >
          Votre compte a bien été créé.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-semibold">
            Pseudonyme
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-invalid={errors.username !== undefined}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2"
          />
          {errors.username && (
            <p id="username-error" className="text-sm text-red-400">
              {errors.username}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-semibold">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email !== undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-semibold">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={errors.password !== undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2"
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {errors.global && (
          <p role="alert" className="text-sm text-red-400">
            {errors.global}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#FF6B35] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Création en cours…" : "Créer mon compte"}
        </button>
      </form>
    </section>
  );
}

export default Register;
