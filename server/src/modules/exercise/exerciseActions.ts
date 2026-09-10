import type { RequestHandler } from "express";
import exerciseRepository from "./exerciseRepository";
import type { ExerciseSummary } from "./exerciseTypes";

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
  } catch (err) {
    next(err);
  }
};

export default { browse };
