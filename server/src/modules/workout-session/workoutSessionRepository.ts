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
        AND workout_session.id = ?
      GROUP BY workout_session.id`,
      [userId, sessionId],
    );

    return rows[0];
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

    if (session.status !== "prepared") {
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
