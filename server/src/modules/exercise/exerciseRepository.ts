import databaseClient from "../../../database/client";

import type { RowDataPacket } from "mysql2/promise";
import type { ExerciseSummary } from "./exerciseTypes";

type ExerciseRow = Omit<ExerciseSummary, "imageUrl"> & RowDataPacket;

class ExerciseRepository {
  async readAll(): Promise<Omit<ExerciseSummary, "imageUrl">[]> {
    const [rows] = await databaseClient.query<ExerciseRow[]>(
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
