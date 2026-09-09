import databaseClient from "../../../database/client";

import type { RowDataPacket } from "mysql2/promise";
import type { ExerciseSummary } from "./exerciseTypes";

type ExerciseSummaryRow = ExerciseSummary & RowDataPacket;

class ExerciseRepository {
  async readAll(
    categoryId?: number,
    difficultyId?: number,
    equipmentId?: number,
    search?: string,
  ): Promise<ExerciseSummary[]> {
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
      conditions.push("exercise.equipment_id = ?");
      values.push(equipmentId);
    }

    if (search) {
      conditions.push("exercise.name LIKE ?");
      values.push(`%${search}%`);
    }

    let whereClause = "";
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    const [rows] = await databaseClient.query<ExerciseSummaryRow[]>(
      `SELECT
        exercise.id, exercise.slug, exercise.name,
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
