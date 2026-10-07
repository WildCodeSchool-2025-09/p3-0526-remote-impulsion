import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

class WorkoutTemplateRepository {
  async readAll(userId: number) {
    const [templateRows] = await databaseClient.query<Rows>(
      `SELECT
        workout_template.id,
        workout_template.name,
        workout_template.estimated_duration_minutes AS estimatedDurationMinutes,
        workout_template.position,
        program.name AS programName
       FROM workout_template
       JOIN program
         ON program.id = workout_template.program_id
       WHERE program.user_id = ?
       ORDER BY program.created_at, workout_template.position`,
      [userId],
    );

    if (templateRows.length === 0) {
      return [];
    }

    const templateIds = templateRows.map((template) => Number(template.id));
    const placeholders = templateIds.map(() => "?").join(", ");
    const [exerciseRows] = await databaseClient.query<Rows>(
      `SELECT
        workout_template_exercise.id AS templateExerciseId,
        workout_template_exercise.workout_template_id AS templateId,
        exercise.id,
        exercise.slug,
        exercise.name,
        category.name AS category,
        workout_template_exercise.position,
        workout_template_exercise.rest_seconds AS restSeconds
       FROM workout_template_exercise
       JOIN exercise
         ON exercise.id = workout_template_exercise.exercise_id
       JOIN category
         ON category.id = exercise.category_id
       WHERE workout_template_exercise.workout_template_id IN (${placeholders})
       ORDER BY workout_template_exercise.workout_template_id,
         workout_template_exercise.position`,
      templateIds,
    );

    return templateRows.map((template) => ({
      ...template,
      exercises: exerciseRows.filter(
        (exercise) => Number(exercise.templateId) === Number(template.id),
      ),
    }));
  }

  async updateExerciseRest(
    templateId: number,
    templateExerciseId: number,
    userId: number,
    restSeconds: number | null,
  ) {
    const [result] = await databaseClient.query<Result>(
      `UPDATE workout_template_exercise
       JOIN workout_template
         ON workout_template.id = workout_template_exercise.workout_template_id
       JOIN program
         ON program.id = workout_template.program_id
       SET workout_template_exercise.rest_seconds = ?
       WHERE workout_template.id = ?
         AND workout_template_exercise.id = ?
         AND program.user_id = ?`,
      [restSeconds, templateId, templateExerciseId, userId],
    );

    return result.affectedRows;
  }

  async prepareSession(templateId: number, userId: number) {
    const [templateRows] = await databaseClient.query<Rows>(
      `SELECT workout_template.id
       FROM workout_template
       JOIN program
         ON program.id = workout_template.program_id
       WHERE workout_template.id = ?
         AND program.user_id = ?`,
      [templateId, userId],
    );

    if (templateRows[0] === undefined) {
      return undefined;
    }

    const [sessionResult] = await databaseClient.query<Result>(
      `INSERT INTO workout_session (user_id, workout_template_id, status)
       VALUES (?, ?, 'prepared')`,
      [userId, templateId],
    );

    const sessionId = sessionResult.insertId;

    await databaseClient.query<Result>(
      `INSERT INTO workout_session_exercise (
        workout_session_id,
        exercise_id,
        position,
        target_sets,
        target_reps,
        target_weight_kg,
        target_duration_seconds,
        rest_seconds
      )
      SELECT
        ?,
        exercise_id,
        position,
        target_sets,
        target_reps,
        target_weight_kg,
        target_duration_seconds,
        rest_seconds
      FROM workout_template_exercise
      WHERE workout_template_id = ?`,
      [sessionId, templateId],
    );

    return sessionId;
  }
}

export default new WorkoutTemplateRepository();
