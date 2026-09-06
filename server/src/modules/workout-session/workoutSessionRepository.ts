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
      `SELECT id,
          user_id AS userId,
          created_at AS createdAt,
          started_at AS startedAt,
          ended_at AS endedAt,
          status
        FROM workout_session
        WHERE user_id = ?
        AND status = 'prepared'`,
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
