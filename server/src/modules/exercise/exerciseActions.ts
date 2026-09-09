import type { RequestHandler } from "express";
import exerciseRepository from "./exerciseRepository";
import type { ExerciseDetail } from "./exerciseTypes";

type ExerciseIdParams = {
  id: string;
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

export default { read };
