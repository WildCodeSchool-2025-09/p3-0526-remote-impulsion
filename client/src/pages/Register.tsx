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
    <section className="min-h-full bg-base-100 px-4 py-8 text-base-content">
      <h1 className="mb-6 font-display font-extrabold text-3xl uppercase italic">
        Créer un compte
      </h1>

      {isSuccess && (
        <output className="mb-4 block rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-success text-sm">
          Votre compte a bien été créé.
        </output>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-semibold text-sm">
            Pseudonyme
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-invalid={errors.username !== undefined}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="rounded-lg border border-base-300 bg-base-200 px-3 py-2"
          />
          {errors.username && (
            <p id="username-error" className="text-error text-sm">
              {errors.username}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold text-sm">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email !== undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="rounded-lg border border-base-300 bg-base-200 px-3 py-2"
          />
          {errors.email && (
            <p id="email-error" className="text-error text-sm">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-semibold text-sm">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={errors.password !== undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="rounded-lg border border-base-300 bg-base-200 px-3 py-2"
          />
          {errors.password && (
            <p id="password-error" className="text-error text-sm">
              {errors.password}
            </p>
          )}
        </div>

        {errors.global && (
          <p role="alert" className="text-error text-sm">
            {errors.global}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-3 font-semibold text-primary-content disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Création en cours…" : "Créer mon compte"}
        </button>
      </form>
    </section>
  );
}

export default Register;
