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
