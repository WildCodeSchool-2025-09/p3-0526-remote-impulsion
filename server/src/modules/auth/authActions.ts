import argon2 from "argon2";
import type { RequestHandler } from "express";
import authRepository from "./authRepository";
import type { RegisterPayload } from "./authTypes";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = (req.body ??
      {}) as Partial<RegisterPayload>;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(422).json({
        errors: {
          global: "Pseudonyme, e-mail et mot de passe sont obligatoires",
        },
      });
      return;
    }

    const errors: Record<string, string> = {};

    if (username.trim().length < 3) {
      errors.username = "Le pseudonyme doit faire au moins 3 caractères";
    } else if (username.trim().length > 50) {
      errors.username = "Le pseudonyme ne doit pas dépasser 50 caractères";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Format d'email invalide";
    }

    const passwordProblems: string[] = [];

    if (password.length < 8) {
      passwordProblems.push("8 caractères minimum");
    }
    if (!/[0-9]/.test(password)) {
      passwordProblems.push("1 chiffre");
    }
    if (!/[a-z]/.test(password)) {
      passwordProblems.push("1 minuscule");
    }
    if (!/[A-Z]/.test(password)) {
      passwordProblems.push("1 majuscule");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      passwordProblems.push("1 caractère spécial");
    }

    if (passwordProblems.length > 0) {
      errors.password = `Le mot de passe doit contenir : ${passwordProblems.join(", ")}`;
    }

    if (Object.keys(errors).length > 0) {
      res.status(422).json({ errors });
      return;
    }

    const existingEmail = await authRepository.readByEmail(email);
    if (existingEmail) {
      res
        .status(409)
        .json({ errors: { email: "Cet e-mail est déjà utilisé" } });
      return;
    }

    const existingUsername = await authRepository.readByUsername(username);
    if (existingUsername) {
      res
        .status(409)
        .json({ errors: { username: "Ce pseudonyme est déjà utilisé" } });
      return;
    }

    const hashedPassword = await argon2.hash(password);

    await authRepository.create(username, email, hashedPassword);

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { register };
