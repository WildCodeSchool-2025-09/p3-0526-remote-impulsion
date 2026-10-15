export type WorkoutTemplateExercise = {
  templateExerciseId: number;
  templateId: number;
  id: number;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
  position: number;
  restSeconds: number | null;
};

export type WorkoutTemplate = {
  id: number;
  name: string;
  programName: string;
  estimatedDurationMinutes: number | null;
  position: number;
  exercises: WorkoutTemplateExercise[];
};
