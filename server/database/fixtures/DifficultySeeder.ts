import AbstractSeeder from "./AbstractSeeder";
import dataset from "../../data/exerciseDataset";

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
