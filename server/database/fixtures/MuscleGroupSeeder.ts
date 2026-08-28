import AbstractSeeder from "./AbstractSeeder";
import dataset from "../../data/exerciseDataset";

class MuscleGroupSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "muscle_group", truncate: true });
  }

  run() {
    for (const muscle of dataset.muscles) {
      this.insert({
        name: muscle.fr,
        refName: `muscle_${muscle.id}`,
      });
    }
  }
}

export default MuscleGroupSeeder;
