import type { RequestHandler } from "express";
import exerciseRepository from "./exerciseRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const exercises = await exerciseRepository.readAll();

    res.json(exercises);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const exerciseId = Number(req.params.id);
    const exercise = await exerciseRepository.read(exerciseId);

    if (exercise == null) {
      res.sendStatus(404);
      return;
    }

    const [muscles, equipment] = await Promise.all([
      exerciseRepository.readMuscles(exerciseId),
      exerciseRepository.readEquipment(exerciseId),
    ]);

    res.json({ ...exercise, muscles, equipment });
  } catch (err) {
    next(err);
  }
};

export default { browse, read };
