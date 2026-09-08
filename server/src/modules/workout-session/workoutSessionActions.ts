import type { RequestHandler } from "express";
import workoutSessionRepository from "./workoutSessionRepository";
import { getCurrentUserId } from "../../helpers/currentUser";

const add: RequestHandler = async (req, res, next) => {
  try {
    const userId = getCurrentUserId();
    const sessionId = await workoutSessionRepository.create(userId);

    res.status(201).json({ id: sessionId });
  } catch (err) {
    next(err);
  }
};

const browse: RequestHandler = async (req, res, next) => {
  try {
    const userId = getCurrentUserId();
    const sessions = await workoutSessionRepository.readAllPrepared(userId);

    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = getCurrentUserId();
    const sessionId = Number.parseInt(req.params.id);
    const nbRowsAffected = await workoutSessionRepository.delete(
      sessionId,
      userId,
    );

    if (nbRowsAffected === 0) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export { add, browse, destroy };
