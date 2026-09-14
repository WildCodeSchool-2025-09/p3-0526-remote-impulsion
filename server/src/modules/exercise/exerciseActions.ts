import type { RequestHandler } from "express";
import exerciseRepository from "./exerciseRepository";
import type { ExerciseDetail, ExerciseSummary } from "./exerciseTypes";

type ExerciseIdParams = {
  id: string;
};

function buildImageUrl(slug: string) {
  return `/assets/images/${slug}.jpg`;
}

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
      imageUrl: buildImageUrl(exercise.slug),
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
      res.sendStatus(400);
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
      imageUrl: buildImageUrl(exercise.slug),
      muscles,
      equipment,
    };

    res.json(exerciseDetail);
  } catch (error) {
    next(error);
  }
};

export default { browse, read };
