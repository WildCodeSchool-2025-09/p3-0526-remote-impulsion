import type { RowDataPacket } from "mysql2/promise";
import databaseClient from "../../../database/client";
import type {
  Exercise,
  ExerciseEquipment,
  ExerciseMuscle,
  ExerciseSummary,
} from "./exerciseTypes";

type ExerciseSummaryRow = Omit<ExerciseSummary, "imageUrl"> & RowDataPacket;
type ExerciseRow = Exercise & RowDataPacket;
type ExerciseMuscleRow = ExerciseMuscle & RowDataPacket;
type ExerciseEquipmentRow = ExerciseEquipment & RowDataPacket;

class ExerciseRepository {
  async readAll(): Promise<Omit<ExerciseSummary, "imageUrl">[]> {
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

  async read(id: number): Promise<Exercise | undefined> {
    const [rows] = await databaseClient.query<ExerciseRow[]>(
      `SELECT
        exercise.id, exercise.slug, exercise.name, exercise.description,
        category.name AS category,
        difficulty.name AS difficulty
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
      `SELECT
        muscle_group.id AS muscleGroupId,
        muscle_group.name,
        exercise_muscle.role
      FROM exercise_muscle
      JOIN muscle_group
        ON muscle_group.id = exercise_muscle.muscle_group_id
      WHERE exercise_muscle.exercise_id = ?
      ORDER BY exercise_muscle.role, muscle_group.name`,
      [exerciseId],
    );

    return rows;
  }

  async readEquipment(exerciseId: number): Promise<ExerciseEquipment[]> {
    const [rows] = await databaseClient.query<ExerciseEquipmentRow[]>(
      `SELECT
        equipment.id AS equipmentId,
        equipment.name
      FROM exercise_equipment
      JOIN equipment ON equipment.id = exercise_equipment.equipment_id
      WHERE exercise_equipment.exercise_id = ?
      ORDER BY equipment.name`,
      [exerciseId],
    );

    return rows;
  }
}

export default new ExerciseRepository();
