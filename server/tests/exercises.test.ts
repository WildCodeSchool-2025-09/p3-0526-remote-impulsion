import "dotenv/config";
import request from "supertest";
import app from "../src/app";
import exerciseRepository from "../src/modules/exercise/exerciseRepository";

describe("GET /api/exercises", () => {
  test("renvoie le statut 200", async () => {
    const response = await request(app).get("/api/exercises");
    expect(response.status).toBe(200);
  });

  test("renvoie le statut 500 si la base échoue", async () => {
    // on force le repository a echouer pour verifier la gestion d'erreur
    jest
      .spyOn(exerciseRepository, "readAll")
      .mockRejectedValueOnce(new Error("DB down"));

    const response = await request(app).get("/api/exercises");

    expect(response.status).toBe(500);

    jest.restoreAllMocks();
  });
});
