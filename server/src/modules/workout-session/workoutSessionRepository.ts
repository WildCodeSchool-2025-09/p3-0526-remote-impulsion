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

  async delete(sessionId: number, userId: number) {
    const [result] = await databaseClient.query<Result>(
      `DELETE FROM workout_session
        WHERE id = ?
        AND user_id = ?`,
      [sessionId, userId],
    );
    return result.affectedRows;
  }
}

export default new WorkoutSessionRepository();
