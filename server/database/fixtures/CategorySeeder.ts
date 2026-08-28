import AbstractSeeder from "./AbstractSeeder";
import dataset from "../../data/exerciseDataset";

class CategorySeeder extends AbstractSeeder {
  constructor() {
    super({ table: "category", truncate: true });
  }

  run() {
    for (const group of dataset.groups) {
      this.insert({
        name: group.fr,
        refName: `category_${group.id}`,
      });
    }
  }
}

export default CategorySeeder;
