import databaseClient from "../../../database/client";

import type { Rows } from "../../../database/client";

type Exercise = {
  id: number;
  slug: string;
  name: string;
  description: string;
  categoryName: string;
  difficultyName: string;
};

type ExerciseMuscle = {
  muscleGroupId: number;
  name: string;
  role: "primary" | "secondary";
};

type ExerciseEquipment = {
  equipmentId: number;
  name: string;
};

class ExerciseRepository {
  // The Rs of BREAD - Read operations

  async readAll() {
    // Join category and difficulty to return their name directly,
    // rather than making the front do a second request per exercise.
    const [rows] = await databaseClient.query<Rows>(
      `select
        exercise.id, exercise.slug, exercise.name,
        category.name as categoryName,
        difficulty.name as difficultyName
      from exercise
      join category on category.id = exercise.category_id
      join difficulty on difficulty.id = exercise.difficulty_id
      order by exercise.name`,
    );

    return rows;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
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

    return rows[0] as Exercise | undefined;
  }

  async readMuscles(exerciseId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `select muscle_group.id as muscleGroupId, muscle_group.name, exercise_muscle.role
      from exercise_muscle
      join muscle_group on muscle_group.id = exercise_muscle.muscle_group_id
      where exercise_muscle.exercise_id = ?`,
      [exerciseId],
    );

    return rows as ExerciseMuscle[];
  }

  async readEquipment(exerciseId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `select equipment.id as equipmentId, equipment.name
      from exercise_equipment
      join equipment on equipment.id = exercise_equipment.equipment_id
      where exercise_equipment.exercise_id = ?`,
      [exerciseId],
    );

    return rows as ExerciseEquipment[];
  }
}

export default new ExerciseRepository();
