import type { RowDataPacket } from "mysql2/promise";
import databaseClient from "../../../database/client";
import type {
  Exercise,
  ExerciseEquipment,
  ExerciseMuscle,
} from "./exerciseTypes";

type ExerciseRow = Exercise & RowDataPacket;
type ExerciseMuscleRow = ExerciseMuscle & RowDataPacket;
type ExerciseEquipmentRow = ExerciseEquipment & RowDataPacket;

class ExerciseRepository {
  async read(id: number): Promise<Exercise | undefined> {
    const [rows] = await databaseClient.query<ExerciseRow[]>(
      "SELECT e.id, e.slug, e.name,e.description,c.name AS category,d.name AS difficulty FROM exercise AS e JOIN category AS c ON c.id = e.category_id JOIN difficulty AS d ON d.id = e.difficulty_id WHERE e.id = ?",
      [id],
    );
    return rows[0];
  }
  async readMuscles(exerciseId: number): Promise<ExerciseMuscle[]> {
    const [rows] = await databaseClient.query<ExerciseMuscleRow[]>(
      "SELECT mg.id AS muscleGroupId, mg.name, em.role FROM exercise_muscle AS em JOIN muscle_group AS mg ON mg.id = em.muscle_group_id WHERE em.exercise_id = ? ORDER BY em.role, mg.name",
      [exerciseId],
    );
    return rows;
  }
  async readEquipment(exerciseId: number): Promise<ExerciseEquipment[]> {
    const [rows] = await databaseClient.query<ExerciseEquipmentRow[]>(
      "SELECT e.id AS equipmentId, e.name FROM exercise_equipment AS ee JOIN equipment AS e ON e.id = ee.equipment_id WHERE ee.exercise_id = ? ORDER BY e.name",
      [exerciseId],
    );
    return rows;
  }
}

export default new ExerciseRepository();
