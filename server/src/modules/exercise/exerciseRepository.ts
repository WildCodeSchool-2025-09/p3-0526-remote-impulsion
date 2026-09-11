import databaseClient from "../../../database/client";

import type { RowDataPacket } from "mysql2/promise";
import type { ExerciseSummary } from "./exerciseTypes";

type ExerciseRow = Omit<ExerciseSummary, "imageUrl"> & RowDataPacket;

class ExerciseRepository {
  async readAll(
    categoryId?: number,
    difficultyId?: number,
    equipmentId?: number,
    search?: string,
  ): Promise<Omit<ExerciseSummary, "imageUrl">[]> {
    const conditions: string[] = [];
    const values: (number | string)[] = [];

    if (categoryId) {
      conditions.push("exercise.category_id = ?");
      values.push(categoryId);
    }

    if (difficultyId) {
      conditions.push("exercise.difficulty_id = ?");
      values.push(difficultyId);
    }

    if (equipmentId) {
      conditions.push(
        "EXISTS (SELECT 1 FROM exercise_equipment WHERE exercise_equipment.exercise_id = exercise.id AND exercise_equipment.equipment_id = ?)",
      );
      values.push(equipmentId);
    }

    if (search) {
      conditions.push("exercise.name COLLATE utf8mb4_unicode_ci LIKE ?");
      values.push(`%${search}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await databaseClient.query<ExerciseRow[]>(
      `SELECT
        exercise.id,
        exercise.slug,
        exercise.name,
        category.name AS category
      FROM exercise
      JOIN category ON category.id = exercise.category_id
      ${whereClause}
      ORDER BY exercise.name`,
      values,
    );

    return rows;
  }
}

export default new ExerciseRepository();
