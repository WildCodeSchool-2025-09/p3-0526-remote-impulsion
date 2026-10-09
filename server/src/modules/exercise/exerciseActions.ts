import type { RequestHandler } from "express";
import { buildImageUrl } from "../../helpers/imageUrl";
import exerciseRepository from "./exerciseRepository";
import type {
  ExerciseDetail,
  ExercisePage,
  ExerciseSummary,
} from "./exerciseTypes";

type ExerciseIdParams = {
  id: string;
};

const browse: RequestHandler<Record<string, never>, ExercisePage> = async (
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

    let page = Number(req.query.page);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    const limit = 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    const items = exercisesWithImage.slice(start, end);
    const total = exercisesWithImage.length;
    const pageCount = Math.ceil(total / limit);

    res.json({ items, total, page, pageCount });
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
