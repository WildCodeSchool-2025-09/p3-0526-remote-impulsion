import type { RequestHandler } from "express";
import type { RegisterPayload } from "./authTypes";
import argon2 from "argon2";
import authRepository from "./authRepository";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body as RegisterPayload;

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

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { register };
