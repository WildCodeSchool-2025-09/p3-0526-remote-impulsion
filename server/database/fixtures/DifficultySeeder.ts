import dataset from "../../data/exerciseDataset";
import AbstractSeeder from "./AbstractSeeder";

class DifficultySeeder extends AbstractSeeder {
  constructor() {
    super({ table: "difficulty", truncate: true });
  }

  run() {
    for (const level of dataset.levels) {
      this.insert({
        name: level.fr,
        refName: `difficulty_${level.id}`,
      });
    }
  }
}

export default DifficultySeeder;
