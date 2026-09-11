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

    const exercisesWithImage: ExerciseSummary[] = exercises.map((exercise) => ({
      ...exercise,
      imageUrl: `/assets/images/${exercise.slug}.jpg`,
    }));

    res.json(exercisesWithImage);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler<ExerciseIdParams, ExerciseDetail> = async (
  req,
  res,
  next,
) => {
  try {
    const exerciseId = Number(req.params.id);

    if (!Number.isInteger(exerciseId) || exerciseId <= 0) {
      res.sendStatus(404);
      return;
    }

    const exercise = await exerciseRepository.read(exerciseId);

    if (exercise === undefined) {
      res.sendStatus(404);
      return;
    }

    const [muscles, equipment] = await Promise.all([
      exerciseRepository.readMuscles(exerciseId),
      exerciseRepository.readEquipment(exerciseId),
    ]);

    const exerciseDetail: ExerciseDetail = {
      ...exercise,
      imageUrl: `/assets/images/${exercise.slug}.jpg`,
      muscles,
      equipment,
    };

    res.json(exerciseDetail);
  } catch (error) {
    next(error);
  }
};

export default { browse, read };
