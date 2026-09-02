export type MuscleRole = "primary" | "secondary";

export type ExerciseSummary = {
  id: number;
  slug: string;
  name: string;
  categoryName: string;
  difficultyName: string;
};

export type Exercise = ExerciseSummary & {
  description: string;
};

export type ExerciseMuscle = {
  muscleGroupId: number;
  name: string;
  role: MuscleRole;
};

export type ExerciseEquipment = {
  equipmentId: number;
  name: string;
};

export type ExerciseDetail = Exercise & {
  muscles: ExerciseMuscle[];
  equipment: ExerciseEquipment[];
};
