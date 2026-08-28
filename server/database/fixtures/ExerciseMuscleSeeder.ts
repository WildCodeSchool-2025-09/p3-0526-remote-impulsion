import AbstractSeeder from "./AbstractSeeder";
import ExerciseSeeder from "./ExerciseSeeder";
import MuscleGroupSeeder from "./MuscleGroupSeeder";
import dataset from "../../data/exerciseDataset";

class ExerciseMuscleSeeder extends AbstractSeeder {
  constructor() {
    super({
      table: "exercise_muscle",
      truncate: true,
      dependencies: [ExerciseSeeder, MuscleGroupSeeder],
    });
  }

  run() {
    for (const exercise of dataset.exercises) {
      const exerciseRef = this.getRef(`exercise_${exercise.slug}`);

      for (const muscle of exercise.primaryMuscles) {
        const muscleRef = this.getRef(`muscle_${muscle.id}`);

        this.insert({
          exercise_id: exerciseRef.insertId,
          muscle_group_id: muscleRef.insertId,
          role: "primary",
        });
      }

      for (const muscle of exercise.secondaryMuscles) {
        const muscleRef = this.getRef(`muscle_${muscle.id}`);

        this.insert({
          exercise_id: exerciseRef.insertId,
          muscle_group_id: muscleRef.insertId,
          role: "secondary",
        });
      }
    }
  }
}

export default ExerciseMuscleSeeder;
