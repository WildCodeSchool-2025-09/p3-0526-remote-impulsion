import databaseClient from "../../../database/client";

import type { RowDataPacket } from "mysql2/promise";
import type {
  Exercise,
  ExerciseEquipment,
  ExerciseMuscle,
  ExerciseSummary,
} from "./exerciseTypes";

type ExerciseSummaryRow = ExerciseSummary & RowDataPacket;
type ExerciseRow = Exercise & RowDataPacket;
type ExerciseMuscleRow = ExerciseMuscle & RowDataPacket;
type ExerciseEquipmentRow = ExerciseEquipment & RowDataPacket;

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

  async read(id: number): Promise<Exercise | undefined> {
    const [rows] = await databaseClient.query<ExerciseRow[]>(
      `SELECT
        exercise.id, exercise.slug, exercise.name, exercise.description,
        category.name AS categoryName,
        difficulty.name AS difficultyName
      FROM exercise
      JOIN category ON category.id = exercise.category_id
      JOIN difficulty ON difficulty.id = exercise.difficulty_id
      WHERE exercise.id = ?`,
      [id],
    );

    return rows[0];
  }

  async readMuscles(exerciseId: number): Promise<ExerciseMuscle[]> {
    const [rows] = await databaseClient.query<ExerciseMuscleRow[]>(
      `SELECT muscle_group.id AS muscleGroupId, muscle_group.name, exercise_muscle.role
      FROM exercise_muscle
      JOIN muscle_group ON muscle_group.id = exercise_muscle.muscle_group_id
      WHERE exercise_muscle.exercise_id = ?`,
      [exerciseId],
    );

    return rows;
  }

  async readEquipment(exerciseId: number): Promise<ExerciseEquipment[]> {
    const [rows] = await databaseClient.query<ExerciseEquipmentRow[]>(
      `SELECT equipment.id AS equipmentId, equipment.name
      FROM exercise_equipment
      JOIN equipment ON equipment.id = exercise_equipment.equipment_id
      WHERE exercise_equipment.exercise_id = ?`,
      [exerciseId],
    );

    return rows;
  }
}

export default new ExerciseRepository();
