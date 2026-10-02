import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (typeof token !== "string") {
    res.status(401).json({ error: "Authentification requise" });
    return;
  }

  const appSecret = process.env.APP_SECRET;

  if (appSecret === undefined) {
    next(new Error("APP_SECRET n'est pas configuré"));
    return;
  }

  try {
    const payload = jwt.verify(token, appSecret);

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      res.status(401).json({ error: "Authentification invalide" });
      return;
    }

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json({ error: "Authentification invalide" });
      return;
    }

    req.auth = { userId };
    next();
  } catch {
    res.status(401).json({ error: "Authentification invalide" });
    return;
  }
};

export default authenticate;
