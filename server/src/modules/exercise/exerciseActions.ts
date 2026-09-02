import type { RequestHandler } from "express";
import exerciseRepository from "./exerciseRepository";
import type { ExerciseDetail, ExerciseSummary } from "./exerciseTypes";

type ExerciseIdParams = {
  id: string;
};

const browse: RequestHandler<Record<string, never>, ExerciseSummary[]> = async (
  _req,
  res,
  next,
) => {
  try {
    const exercises = await exerciseRepository.readAll();

    res.json(exercises);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler<ExerciseIdParams, ExerciseDetail> = async (
  req,
  res,
  next,
) => {
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

    const exerciseDetail: ExerciseDetail = {
      ...exercise,
      muscles,
      equipment,
    };

    res.json(exerciseDetail);
  } catch (err) {
    next(err);
  }
};

export default { browse, read };
