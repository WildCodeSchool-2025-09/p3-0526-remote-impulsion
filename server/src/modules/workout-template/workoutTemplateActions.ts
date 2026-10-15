import type { RequestHandler } from "express";
import { getCurrentUserId } from "../../helpers/currentUser";
import { buildImageUrl } from "../../helpers/imageUrl";
import { isAllowedRestSeconds } from "../../helpers/restTime";
import workoutTemplateRepository from "./workoutTemplateRepository";

type WorkoutTemplateParams = {
  id: string;
};

type WorkoutTemplateExerciseParams = WorkoutTemplateParams & {
  templateExerciseId: string;
};

type UpdateExerciseRestBody = {
  restSeconds: number | null;
};

const browse: RequestHandler = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const templates = await workoutTemplateRepository.readAll(userId);

    res.json(
      templates.map((template) => ({
        ...template,
        exercises: template.exercises.map((exercise) => ({
          ...exercise,
          imageUrl: buildImageUrl(exercise.slug),
        })),
      })),
    );
  } catch (err) {
    next(err);
  }
};

const updateExerciseRest: RequestHandler<
  WorkoutTemplateExerciseParams,
  unknown,
  UpdateExerciseRestBody
> = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);
    const templateId = Number(req.params.id);
    const templateExerciseId = Number(req.params.templateExerciseId);

    if (
      !Number.isInteger(templateId) ||
      templateId <= 0 ||
      !Number.isInteger(templateExerciseId) ||
      templateExerciseId <= 0 ||
      !isAllowedRestSeconds(req.body?.restSeconds)
    ) {
      res.sendStatus(400);
      return;
    }

    const affectedRows = await workoutTemplateRepository.updateExerciseRest(
      templateId,
      templateExerciseId,
      userId,
      req.body.restSeconds,
    );

    if (affectedRows === 0) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const prepareSession: RequestHandler<WorkoutTemplateParams> = async (
  req,
  res,
  next,
) => {
  try {
    const userId = getCurrentUserId(req);
    const templateId = Number(req.params.id);

    if (!Number.isInteger(templateId) || templateId <= 0) {
      res.sendStatus(400);
      return;
    }

    const sessionId = await workoutTemplateRepository.prepareSession(
      templateId,
      userId,
    );

    if (sessionId === undefined) {
      res.sendStatus(404);
      return;
    }

    res.status(201).json({ id: sessionId });
  } catch (err) {
    next(err);
  }
};

export default { browse, updateExerciseRest, prepareSession };
