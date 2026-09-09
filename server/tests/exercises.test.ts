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
    jest
      .spyOn(exerciseRepository, "readAll")
      .mockRejectedValueOnce(new Error("DB down"));

    const response = await request(app).get("/api/exercises");

    expect(response.status).toBe(500);

    jest.restoreAllMocks();
  });
});

describe("GET /api/exercises - recherche et filtres", () => {
  test("la recherche est insensible à la casse et aux accents", async () => {
    const [lower, upper, accented] = await Promise.all([
      request(app).get("/api/exercises").query({ search: "developpe" }),
      request(app).get("/api/exercises").query({ search: "DEVELOPPE" }),
      request(app).get("/api/exercises").query({ search: "développé" }),
    ]);

    expect(lower.status).toBe(200);
    expect(lower.body).toHaveLength(15);
    expect(upper.body).toHaveLength(15);
    expect(accented.body).toHaveLength(15);
    expect(
      lower.body.map((exercise: { slug: string }) => exercise.slug),
    ).toContain("seated-chest-press");
  });

  test("filtre par catégorie", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ categoryId: 5 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(31);
    expect(
      response.body.every(
        (exercise: { category: string }) => exercise.category === "Jambes",
      ),
    ).toBe(true);
  });

  test("filtre par difficulté", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ difficultyId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(105);
    const slugs = response.body.map(
      (exercise: { slug: string }) => exercise.slug,
    );
    expect(slugs).toContain("push-ups");
    expect(slugs).not.toContain("pull-ups");
  });

  test("filtre par équipement", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ equipmentId: 4 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(24);
    const slugs = response.body.map(
      (exercise: { slug: string }) => exercise.slug,
    );
    expect(slugs).toContain("deadlift");
    expect(slugs).not.toContain("push-ups");
  });

  test("combine plusieurs filtres en AND", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ categoryId: 5, difficultyId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(17);
    expect(
      response.body.every(
        (exercise: { category: string }) => exercise.category === "Jambes",
      ),
    ).toBe(true);
    const slugs = response.body.map(
      (exercise: { slug: string }) => exercise.slug,
    );
    expect(slugs).toContain("bodyweight-squat");
    expect(slugs).not.toContain("deadlift");
  });

  test("la recherche se combine avec un filtre", async () => {
    const [searchOnly, combined] = await Promise.all([
      request(app).get("/api/exercises").query({ search: "developpe" }),
      request(app)
        .get("/api/exercises")
        .query({ search: "developpe", categoryId: 1 }),
    ]);

    expect(combined.status).toBe(200);
    // la combinaison est plus restrictive que la recherche seule
    expect(combined.body.length).toBeLessThan(searchOnly.body.length);
    expect(combined.body).toHaveLength(8);
    expect(
      combined.body.every(
        (exercise: { category: string; name: string }) =>
          exercise.category === "Pectoraux" &&
          exercise.name.toLowerCase().includes("développé".toLowerCase()),
      ),
    ).toBe(true);
  });

  test("une seule valeur peut être active par famille", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ categoryId: 5 });

    const categories = new Set(
      response.body.map((exercise: { category: string }) => exercise.category),
    );
    expect(categories.size).toBe(1);
    expect(categories.has("Jambes")).toBe(true);
  });

  test("la réinitialisation des filtres renvoie le catalogue complet", async () => {
    const response = await request(app).get("/api/exercises");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(151);
  });

  test("renvoie un tableau vide quand aucun exercice ne correspond", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ search: "zzzznotfound" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(response.body).toHaveLength(0);
  });
});

describe("Sources des panneaux de filtres", () => {
  test("le panneau zone musculaire ne propose que des catégories, jamais les muscles précis", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    const names = response.body.map((item: { name: string }) => item.name);

    expect(names).toEqual([
      "Abdominaux",
      "Bras",
      "Cardio",
      "Dos",
      "Épaules",
      "Étirements",
      "Jambes",
      "Pectoraux",
    ]);
    // les muscles precis vivent dans muscle_group / exercise_muscle : hors du filtre
    for (const muscle of [
      "Triceps",
      "Biceps",
      "Quadriceps",
      "Ischio-jambiers",
      "Dorsaux",
      "Obliques",
      "Mollets",
      "Fessiers",
    ]) {
      expect(names).not.toContain(muscle);
    }
  });

  test("les panneaux matériel et difficulté renvoient des { id, name }", async () => {
    const [equipmentResponse, difficultiesResponse] = await Promise.all([
      request(app).get("/api/equipment"),
      request(app).get("/api/difficulties"),
    ]);

    expect(equipmentResponse.status).toBe(200);
    expect(difficultiesResponse.status).toBe(200);
    expect(
      difficultiesResponse.body.map((item: { name: string }) => item.name),
    ).toEqual(["Avancé", "Débutant", "Intermédiaire"]);
    expect(equipmentResponse.body).toHaveLength(6);
    for (const item of [
      ...equipmentResponse.body,
      ...difficultiesResponse.body,
    ]) {
      expect(typeof item.id).toBe("number");
      expect(typeof item.name).toBe("string");
    }
  });
});
