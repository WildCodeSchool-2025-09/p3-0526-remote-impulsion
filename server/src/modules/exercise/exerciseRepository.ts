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
  async readAll(): Promise<ExerciseSummary[]> {
    const [rows] = await databaseClient.query<ExerciseSummaryRow[]>(
      `select
        exercise.id, exercise.slug, exercise.name,
        category.name as category
      from exercise
      join category on category.id = exercise.category_id
      order by exercise.name`,
    );

    return rows;
  }

  async read(id: number): Promise<Exercise | undefined> {
    const [rows] = await databaseClient.query<ExerciseRow[]>(
      `select
        exercise.id, exercise.slug, exercise.name, exercise.description,
        category.name as categoryName,
        difficulty.name as difficultyName
      from exercise
      join category on category.id = exercise.category_id
      join difficulty on difficulty.id = exercise.difficulty_id
      where exercise.id = ?`,
      [id],
    );

    return rows[0];
  }

  async readMuscles(exerciseId: number): Promise<ExerciseMuscle[]> {
    const [rows] = await databaseClient.query<ExerciseMuscleRow[]>(
      `select muscle_group.id as muscleGroupId, muscle_group.name, exercise_muscle.role
      from exercise_muscle
      join muscle_group on muscle_group.id = exercise_muscle.muscle_group_id
      where exercise_muscle.exercise_id = ?`,
      [exerciseId],
    );

    return rows;
  }

  async readEquipment(exerciseId: number): Promise<ExerciseEquipment[]> {
    const [rows] = await databaseClient.query<ExerciseEquipmentRow[]>(
      `select equipment.id as equipmentId, equipment.name
      from exercise_equipment
      join equipment on equipment.id = exercise_equipment.equipment_id
      where exercise_equipment.exercise_id = ?`,
      [exerciseId],
    );

    return rows;
  }
}

export default new ExerciseRepository();
