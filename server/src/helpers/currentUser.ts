import type { Request } from "express";

export function getCurrentUserId(req: Request): number {
  const userId = req.auth?.userId;

  if (userId === undefined) {
    throw new Error("Utilisateur non authentifié");
  }
  return userId;
}
