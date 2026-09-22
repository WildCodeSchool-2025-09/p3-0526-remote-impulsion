import type { RegisterPayload } from "../types/authTypes";

type RegisterResult = {
  success: boolean;
  errors: Record<string, string>;
};

async function registerUser(payload: RegisterPayload): Promise<RegisterResult> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (response.status === 201) {
    return { success: true, errors: {} };
  }

  const data = await response.json();

  return {
    success: false,
    errors: data.errors ?? { global: "Une erreur est survenue." },
  };
}

export default { registerUser };
