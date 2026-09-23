import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

class WorkoutSessionRepository {
  async create(userId: number) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO workout_session (user_id, status) 
        VALUES (?, 'prepared')`,
      [userId],
    );
    return result.insertId;
  }

  async readAllPrepared(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT
        workout_session.id,
        workout_session.user_id AS userId,
        workout_session.created_at AS createdAt,
        workout_session.started_at AS startedAt,
        workout_session.ended_at AS endedAt,
        workout_session.status,
        COUNT(workout_session_exercise.id) AS exerciseCount
      FROM workout_session
      LEFT JOIN workout_session_exercise
        ON workout_session.id = workout_session_exercise.workout_session_id
      WHERE workout_session.user_id = ?
        AND workout_session.status = 'prepared'
      GROUP BY workout_session.id
      ORDER BY workout_session.created_at DESC`,
      [userId],
    );

    return rows;
  }

  async read(sessionId: number, userId: number) {
    const [sessionRows] = await databaseClient.query<Rows>(
      `SELECT
        workout_session.id,
        workout_session.user_id AS userId,
        workout_session.created_at AS createdAt,
        workout_session.started_at AS startedAt,
        workout_session.ended_at AS endedAt,
        workout_session.status,
        COUNT(workout_session_exercise.id) AS exerciseCount
      FROM workout_session
      LEFT JOIN workout_session_exercise
        ON workout_session.id = workout_session_exercise.workout_session_id
      WHERE workout_session.user_id = ?
        AND workout_session.id = ?
      GROUP BY workout_session.id`,
      [userId, sessionId],
    );

    const session = sessionRows[0] as
      | (Rows[number] & { exerciseCount: number })
      | undefined;

    if (session === undefined) {
      return undefined;
    }

    const [exerciseRows] = await databaseClient.query<Rows>(
      `SELECT
        workout_session_exercise.id AS sessionExerciseId,
        exercise.id,
        exercise.slug,
        exercise.name,
        category.name AS category,
        workout_session_exercise.position,
        workout_session_exercise.target_sets AS targetSets,
        workout_session_exercise.target_reps AS targetReps,
        workout_session_exercise.target_weight_kg AS targetWeightKg,
        workout_session_exercise.target_duration_seconds AS targetDurationSeconds,
        workout_session_exercise.rest_seconds AS restSeconds
      FROM workout_session_exercise
      JOIN exercise
        ON exercise.id = workout_session_exercise.exercise_id
      JOIN category
        ON category.id = exercise.category_id
      WHERE workout_session_exercise.workout_session_id = ?
      ORDER BY workout_session_exercise.position`,
      [sessionId],
    );

    return { ...session, exercises: exerciseRows };
  }

  async addExercises(
    sessionId: number,
    userId: number,
    exerciseIds: number[],
  ): Promise<
    | "created"
    | "session_not_found"
    | "session_not_prepared"
    | "exercise_not_found"
    | "duplicate_exercise"
  > {
    const [sessionRows] = await databaseClient.query<Rows>(
      `SELECT status
       FROM workout_session
       WHERE id = ?
         AND user_id = ?`,
      [sessionId, userId],
    );

    const session = sessionRows[0];

    if (session === undefined) {
      return "session_not_found";
    }

    if (session.status !== "prepared" && session.status !== "in_progress") {
      return "session_not_prepared";
    }

    const placeholders = exerciseIds.map(() => "?").join(", ");

    const [exerciseRows] = await databaseClient.query<Rows>(
      `SELECT id
       FROM exercise
       WHERE id IN (${placeholders})`,
      exerciseIds,
    );

    if (exerciseRows.length !== exerciseIds.length) {
      return "exercise_not_found";
    }

    const [existingRows] = await databaseClient.query<Rows>(
      `SELECT exercise_id
       FROM workout_session_exercise
       WHERE workout_session_id = ?
         AND exercise_id IN (${placeholders})`,
      [sessionId, ...exerciseIds],
    );

    if (existingRows.length > 0) {
      return "duplicate_exercise";
    }

    const [positionRows] = await databaseClient.query<Rows>(
      `SELECT COALESCE(MAX(position), 0) AS maxPosition
       FROM workout_session_exercise
       WHERE workout_session_id = ?`,
      [sessionId],
    );

    const maxPosition = Number(positionRows[0].maxPosition);

    const values = exerciseIds.map((exerciseId, index) => [
      sessionId,
      exerciseId,
      maxPosition + index + 1,
    ]);

    await databaseClient.query<Result>(
      `INSERT INTO workout_session_exercise
        (workout_session_id, exercise_id, position)
       VALUES ?`,
      [values],
    );
    return "created";
  }

  async reorderExercises(
    sessionId: number,
    userId: number,
    sessionExerciseIds: number[],
  ) {
    const [sessionRows] = await databaseClient.query<Rows>(
      `SELECT status
       FROM workout_session
       WHERE id = ?
         AND user_id = ?`,
      [sessionId, userId],
    );

    const session = sessionRows[0];

    if (session === undefined) {
      return "session_not_found";
    }

    if (!["prepared", "in_progress"].includes(session.status)) {
      return "session_not_reorderable";
    }

    const [exerciseRows] = await databaseClient.query<Rows>(
      `SELECT id AS sessionExerciseId
       FROM workout_session_exercise
       WHERE workout_session_id = ?`,
      [sessionId],
    );

    const existingSessionExerciseIds = new Set(
      exerciseRows.map((exercise) => Number(exercise.sessionExerciseId)),
    );

    const containsExactlyTheSameExercises =
      existingSessionExerciseIds.size === sessionExerciseIds.length &&
      sessionExerciseIds.every((sessionExerciseId) =>
        existingSessionExerciseIds.has(sessionExerciseId),
      );

    if (!containsExactlyTheSameExercises) {
      return "invalid_exercise_list";
    }

    const temporaryOffset = sessionExerciseIds.length;

    await databaseClient.query<Result>(
      `UPDATE workout_session_exercise
       SET position = position + ?
       WHERE workout_session_id = ?
       ORDER BY position DESC`,
      [temporaryOffset, sessionId],
    );

    for (const [index, sessionExerciseId] of sessionExerciseIds.entries()) {
      const newPosition = index + 1;

      await databaseClient.query<Result>(
        `UPDATE workout_session_exercise
         SET position = ?
         WHERE id = ?
         AND workout_session_id = ?`,
        [newPosition, sessionExerciseId, sessionId],
      );
    }
    return "reordered";
  }

  async readCurrent(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT
      workout_session.id,
      workout_session.user_id AS userId,
      workout_session.created_at AS createdAt,
      workout_session.started_at AS startedAt,
      workout_session.ended_at AS endedAt,
      workout_session.status,
      COUNT(workout_session_exercise.id) AS exerciseCount
    FROM workout_session
    LEFT JOIN workout_session_exercise
      ON workout_session.id = workout_session_exercise.workout_session_id
    WHERE workout_session.user_id = ?
      AND workout_session.status = 'in_progress'
    GROUP BY workout_session.id
    LIMIT 1`,
      [userId],
    );

    return rows[0];
  }

  async start(sessionId: number, userId: number) {
    const connection = await databaseClient.getConnection();

    try {
      await connection.beginTransaction();

      const [sessions] = await connection.query<Rows>(
        `SELECT id, status
         FROM workout_session
         WHERE user_id = ?
         FOR UPDATE`,
        [userId],
      );

      const hasCurrentSession = sessions.some(
        (session) => session.status === "in_progress",
      );

      if (hasCurrentSession) {
        await connection.rollback();
        return 0;
      }

      const [result] = await connection.query<Result>(
        `UPDATE workout_session
         SET status = 'in_progress',
             started_at = NOW()
         WHERE id = ?
         AND user_id = ?
         AND status = 'prepared'`,
        [sessionId, userId],
      );

      await connection.commit();

      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(sessionId: number, userId: number) {
    const [result] = await databaseClient.query<Result>(
      `DELETE FROM workout_session
        WHERE id = ?
        AND user_id = ?
        AND status = 'prepared'`,
      [sessionId, userId],
    );
    return result.affectedRows;
  }
}

export default new WorkoutSessionRepository();
