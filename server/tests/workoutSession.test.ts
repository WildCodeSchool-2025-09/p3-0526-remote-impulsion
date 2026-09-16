/// <reference types="jest" />
import "dotenv/config";
import request from "supertest";

import databaseClient from "../database/client";
import app from "../src/app";
import workoutSessionRepository from "../src/modules/workout-session/workoutSessionRepository";

describe("US11 - Workout sessions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("crée une séance avec le statut prepared", async () => {
    const queryMock = jest
      .spyOn(databaseClient, "query")
      .mockResolvedValue([{ insertId: 42 }, []] as never);

    const sessionId = await workoutSessionRepository.create(1);

    expect(sessionId).toBe(42);

    const [sql, params] = queryMock.mock.calls[0];

    expect(String(sql)).toMatch(/status/);
    expect(String(sql)).toMatch(/'prepared'/);
    expect(params).toEqual([1]);
  });

  test("crée un nouveau brouillon quand aucun brouillon vide n'existe", async () => {
    jest
      .spyOn(workoutSessionRepository, "readAllPrepared")
      .mockResolvedValue([] as never);

    jest.spyOn(workoutSessionRepository, "create").mockResolvedValue(42);

    const response = await request(app).post("/api/workout-sessions");

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 42 });
  });

  test("réutilise le brouillon vide existant sans créer de doublon", async () => {
    jest
      .spyOn(workoutSessionRepository, "readAllPrepared")
      .mockResolvedValue([{ id: 7, exerciseCount: 0 }] as never);

    const createMock = jest
      .spyOn(workoutSessionRepository, "create")
      .mockResolvedValue(99);

    const response = await request(app).post("/api/workout-sessions");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 7 });

    expect(createMock).not.toHaveBeenCalled();
  });

  test("crée un nouveau brouillon si les prepared existantes contiennent des exercices", async () => {
    jest
      .spyOn(workoutSessionRepository, "readAllPrepared")
      .mockResolvedValue([{ id: 7, exerciseCount: 3 }] as never);

    jest.spyOn(workoutSessionRepository, "create").mockResolvedValue(8);

    const response = await request(app).post("/api/workout-sessions");

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 8 });
  });

  test("supprime une séance prepared", async () => {
    jest.spyOn(workoutSessionRepository, "delete").mockResolvedValue(1);

    const response = await request(app).delete("/api/workout-sessions/7");

    expect(response.status).toBe(204);
  });

  test("refuse la suppression lorsque le repository ne supprime aucune séance", async () => {
    jest.spyOn(workoutSessionRepository, "delete").mockResolvedValue(0);

    const response = await request(app).delete("/api/workout-sessions/7");

    expect(response.status).toBe(404);
  });

  test("le DELETE du repository est limité aux séances prepared", async () => {
    const queryMock = jest
      .spyOn(databaseClient, "query")
      .mockResolvedValue([{ affectedRows: 0 }, []] as never);

    await workoutSessionRepository.delete(7, 1);

    const [sql, params] = queryMock.mock.calls[0];

    expect(String(sql)).toMatch(/status\s*=\s*'prepared'/);
    expect(params).toEqual([7, 1]);
  });
});

describe("US13 - Ajouter des exercices à une séance", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("ajoute plusieurs exercices à une séance préparée", async () => {
    const addExercisesMock = jest
      .spyOn(workoutSessionRepository, "addExercises")
      .mockResolvedValue("created");

    const response = await request(app)
      .post("/api/workout-sessions/7/exercises")
      .send({ exerciseIds: [3, 8, 15] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 7,
      exerciseIds: [3, 8, 15],
    });

    expect(addExercisesMock).toHaveBeenCalledWith(7, 1, [3, 8, 15]);
  });

  test.each([
    ["un body sans exerciseIds", {}],
    ["une liste vide", { exerciseIds: [] }],
    ["un identifiant négatif", { exerciseIds: [3, -1] }],
    ["un doublon", { exerciseIds: [3, 3] }],
  ])("refuse %s", async (_description, body) => {
    const addExercisesMock = jest.spyOn(
      workoutSessionRepository,
      "addExercises",
    );

    const response = await request(app)
      .post("/api/workout-sessions/7/exercises")
      .send(body);

    expect(response.status).toBe(400);
    expect(addExercisesMock).not.toHaveBeenCalled();
  });

  test.each([
    [404, "session_not_found"],
    [404, "exercise_not_found"],
    [409, "session_not_prepared"],
    [409, "duplicate_exercise"],
  ] as const)(
    "renvoie %i lorsque le repository retourne %s",
    async (expectedStatus, repositoryResult) => {
      jest
        .spyOn(workoutSessionRepository, "addExercises")
        .mockResolvedValue(repositoryResult);

      const response = await request(app)
        .post("/api/workout-sessions/7/exercises")
        .send({ exerciseIds: [3, 8] });

      expect(response.status).toBe(expectedStatus);
    },
  );

  test("ajoute les exercices à la suite", async () => {
    const queryMock = jest
      .spyOn(databaseClient, "query")
      .mockResolvedValueOnce([[{ status: "prepared" }], []] as never)
      .mockResolvedValueOnce([[{ id: 3 }, { id: 8 }], []] as never)
      .mockResolvedValueOnce([[], []] as never)
      .mockResolvedValueOnce([[{ maxPosition: 2 }], []] as never)
      .mockResolvedValueOnce([{ affectedRows: 2 }, []] as never);

    const result = await workoutSessionRepository.addExercises(7, 1, [3, 8]);

    expect(result).toBe("created");

    const [insertSql, insertParams] = queryMock.mock.calls[4];

    expect(String(insertSql)).toMatch(/INSERT INTO workout_session_exercise/);
    expect(insertParams).toEqual([
      [
        [7, 3, 3],
        [7, 8, 4],
      ],
    ]);
  });

  test("transmet une erreur de base de données", async () => {
    const databaseError = new Error("Database failure");

    jest
      .spyOn(databaseClient, "query")
      .mockResolvedValueOnce([[{ status: "prepared" }], []] as never)
      .mockRejectedValueOnce(databaseError);
    await expect(
      workoutSessionRepository.addExercises(7, 1, [3, 8]),
    ).rejects.toThrow("Database failure");
  });
});
