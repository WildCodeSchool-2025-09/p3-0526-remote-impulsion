import type { RequestHandler } from "express";
import exerciseRepository from "./exerciseRepository";
import type { ExerciseSummary } from "./exerciseTypes";

const browse: RequestHandler<Record<string, never>, ExerciseSummary[]> = async (
  req,
  res,
  next,
) => {
  try {
    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : undefined;

    const difficultyId = req.query.difficultyId
      ? Number(req.query.difficultyId)
      : undefined;

    const equipmentId = req.query.equipmentId
      ? Number(req.query.equipmentId)
      : undefined;

    const search = req.query.search ? String(req.query.search) : undefined;

    const exercises = await exerciseRepository.readAll(
      categoryId,
      difficultyId,
      equipmentId,
      search,
    );

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
