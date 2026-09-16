import databaseClient from "../../../database/client";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

type UserRow = { id: number } & RowDataPacket;

class AuthRepository {
  async readByEmail(email: string) {
    const [rows] = await databaseClient.query<UserRow[]>(
      "SELECT id FROM user WHERE email = ?",
      [email],
    );

    return rows[0];
  }

  async readByUsername(username: string) {
    const [rows] = await databaseClient.query<UserRow[]>(
      "SELECT id FROM user WHERE username = ?",
      [username],
    );

    return rows[0];
  }

  async create(username: string, email: string, hashedPassword: string) {
    const [result] = await databaseClient.query<ResultSetHeader>(
      "INSERT INTO user(username, email, password) VALUES (?,?,?)",
      [username, email, hashedPassword],
    );

    return result.insertId;
  }
}

export default new AuthRepository();
