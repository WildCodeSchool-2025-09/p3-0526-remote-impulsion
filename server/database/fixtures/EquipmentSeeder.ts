import dataset from "../../data/exerciseDataset";
import AbstractSeeder from "./AbstractSeeder";

class EquipmentSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "equipment", truncate: true });
  }

  run() {
    for (const equipment of dataset.equipment) {
      this.insert({
        name: equipment.fr,
        refName: `equipment_${equipment.id}`,
      });
    }
  }
}

export default EquipmentSeeder;
