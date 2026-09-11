export type ExerciseSummary = {
  id: number;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
};

export type MuscleRole = "primary" | "secondary";

export type ExerciseMuscle = {
  muscleGroupId: number;
  name: string;
  role: MuscleRole;
};

export type ExerciseEquipment = {
  equipmentId: number;
  name: string;
};

export type Exercise = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
};

export type ExerciseDetail = Exercise & {
  imageUrl: string;
  muscles: ExerciseMuscle[];
  equipment: ExerciseEquipment[];
};
