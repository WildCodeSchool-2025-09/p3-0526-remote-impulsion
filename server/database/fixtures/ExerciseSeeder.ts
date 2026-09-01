import dataset from "../../data/exerciseDataset";
import AbstractSeeder from "./AbstractSeeder";
import CategorySeeder from "./CategorySeeder";
import DifficultySeeder from "./DifficultySeeder";

class ExerciseSeeder extends AbstractSeeder {
  constructor() {
    super({
      table: "exercise",
      truncate: true,
      dependencies: [CategorySeeder, DifficultySeeder],
    });
  }

  run() {
    for (const exercise of dataset.exercises) {
      const category = this.getRef(`category_${exercise.group.id}`);
      const difficulty = this.getRef(`difficulty_${exercise.level.id}`);

      const description = exercise.instructions.fr
        .map((step, index) => `${index + 1}. ${step}`)
        .join("\n");

      this.insert({
        slug: exercise.slug,
        name: exercise.name.fr,
        description,
        category_id: category.insertId,
        difficulty_id: difficulty.insertId,
        refName: `exercise_${exercise.slug}`,
      });
    }
  }
}

export default ExerciseSeeder;
