import "dotenv/config";
import request from "supertest";
import databaseClient from "../database/client";
import app from "../src/app";

const unique = Date.now();
const validUser = {
  username: `testeur${unique}`,
  email: `testeur${unique}@test.fr`,
  password: "MonMdp123!",
};
const loginUser = {
  username: `connexion${unique}`,
  email: `connexion${unique}@test.fr`,
  password: "MonMdp123!",
};

describe("POST /api/auth/register", () => {
  afterAll(async () => {
    await databaseClient.query("DELETE FROM user WHERE email LIKE ?", [
      `testeur${unique}%`,
    ]);
  });

  test("crée un compte avec des données valides", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser);

    expect(response.status).toBe(201);
  });

  test("ne renvoie jamais le mot de passe ni son hash", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: `hash${unique}`,
        email: `hash${unique}@test.fr`,
        password: "MonMdp123!",
      });

    const body = JSON.stringify(response.body);

    expect(body).not.toContain("MonMdp123!");
    expect(body).not.toContain("argon2");
  });

  test("refuse un e-mail invalide", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, email: "abc" });

    expect(response.status).toBe(422);
    expect(response.body.errors.email).toBeDefined();
  });

  test("refuse un mot de passe trop faible", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, password: "abc" });

    expect(response.status).toBe(422);
    expect(response.body.errors.password).toBeDefined();
  });

  test("refuse un e-mail déjà utilisé", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, username: `autre${unique}` });

    expect(response.status).toBe(409);
    expect(response.body.errors.email).toBeDefined();
  });

  test("refuse un pseudonyme déjà utilisé", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, email: `autre${unique}@test.fr` });

    expect(response.status).toBe(409);
    expect(response.body.errors.username).toBeDefined();
  });
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(loginUser);

    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await databaseClient.query("DELETE FROM user WHERE email = ?", [
      loginUser.email,
    ]);
    await databaseClient.end();
  });

  test("connecte un utilisateur avec des identifiants valides", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: loginUser.email,
      password: loginUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]?.[0]).toContain("auth_token=");
    expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
  });

  test("refuse des identifiants incorrects", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: loginUser.email,
      password: "MauvaisMotDePasse123!",
    });

    expect(response.status).toBe(401);
    expect(response.body.errors.global).toBe(
      "Adresse e-mail ou mot de passe incorrect",
    );
  });

  test("refuse des champs vides", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "   ",
      password: "   ",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors.global).toBeDefined();
  });
});
