import databaseClient from "../../../database/client";
import type { RowDataPacket } from "mysql2/promise";

export type ReferenceItem = {
  id: number;
  name: string;
};

type ReferenceRow = ReferenceItem & RowDataPacket;

class FiltersRepository {
  async readCategories() {
    const [rows] = await databaseClient.query<ReferenceRow[]>(
      "SELECT id, name FROM category ORDER BY name",
    );
    return rows;
  }

  async readEquipment() {
    const [rows] = await databaseClient.query<ReferenceRow[]>(
      "SELECT id, name FROM equipment ORDER BY name",
    );
    return rows;
  }

  async readDifficulties() {
    const [rows] = await databaseClient.query<ReferenceRow[]>(
      "SELECT id, name FROM difficulty ORDER BY name",
    );
    return rows;
  }
}

export default new FiltersRepository();
