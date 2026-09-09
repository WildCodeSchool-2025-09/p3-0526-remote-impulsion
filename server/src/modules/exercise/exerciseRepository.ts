import databaseClient from "../../../database/client";

import type { RowDataPacket } from "mysql2/promise";
import type { ExerciseSummary } from "./exerciseTypes";

type ExerciseSummaryRow = ExerciseSummary & RowDataPacket;

class ExerciseRepository {
  async readAll(): Promise<ExerciseSummary[]> {
    const [rows] = await databaseClient.query<ExerciseSummaryRow[]>(
      `SELECT
        exercise.id, exercise.slug, exercise.name,
        category.name AS category
      FROM exercise
      JOIN category ON category.id = exercise.category_id
      ORDER BY exercise.name`,
    );

    return rows;
  }
}

export default new ExerciseRepository();
