import AbstractSeeder from "./AbstractSeeder";
import EquipmentSeeder from "./EquipmentSeeder";
import ExerciseSeeder from "./ExerciseSeeder";
import dataset from "../../data/exerciseDataset";

class ExerciseEquipmentSeeder extends AbstractSeeder {
  constructor() {
    super({
      table: "exercise_equipment",
      truncate: true,
      dependencies: [ExerciseSeeder, EquipmentSeeder],
    });
  }

  run() {
    for (const exercise of dataset.exercises) {
      const exerciseRef = this.getRef(`exercise_${exercise.slug}`);
      const equipmentRef = this.getRef(`equipment_${exercise.equipment.id}`);

      this.insert({
        exercise_id: exerciseRef.insertId,
        equipment_id: equipmentRef.insertId,
      });
    }
  }
}

export default ExerciseEquipmentSeeder;
