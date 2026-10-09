import "dotenv/config";
import request from "supertest";
import databaseClient from "../database/client";
import app from "../src/app";
import exerciseRepository from "../src/modules/exercise/exerciseRepository";

afterAll(async () => {
  await databaseClient.end();
});

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

describe("GET /api/exercises/:id", () => {
  test("renvoie le détail d'un exercice existant", async () => {
    const response = await request(app).get("/api/exercises/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        imageUrl: expect.stringMatching(/^\/assets\/images\/.+\.jpg$/),
        muscles: expect.any(Array),
        equipment: expect.any(Array),
      }),
    );
  });

  test("renvoie le statut 400 pour un identifiant invalide", async () => {
    const response = await request(app).get("/api/exercises/abc");

    expect(response.status).toBe(400);
  });

  test("renvoie le statut 404 pour un exercice inexistant", async () => {
    const response = await request(app).get("/api/exercises/2147483647");

    expect(response.status).toBe(404);
  });
});

type ExerciseItem = {
  slug: string;
  name: string;
  category: string;
};

// lit toutes les pages d'une recherche, pour vérifier la liste complète
const getAllExercises = async (query: Record<string, string | number>) => {
  const firstPage = await request(app).get("/api/exercises").query(query);
  const allItems: ExerciseItem[] = [];

  for (const item of firstPage.body.items) {
    allItems.push(item);
  }

  for (let page = 2; page <= firstPage.body.pageCount; page = page + 1) {
    const nextPage = await request(app)
      .get("/api/exercises")
      .query(query)
      .query({ page: page });

    for (const item of nextPage.body.items) {
      allItems.push(item);
    }
  }

  return allItems;
};

const getSlugs = (items: ExerciseItem[]) => {
  const slugs: string[] = [];

  for (const item of items) {
    slugs.push(item.slug);
  }

  return slugs;
};

describe("GET /api/exercises - recherche et filtres", () => {
  test("la recherche est insensible à la casse et aux accents", async () => {
    const [lower, upper, accented] = await Promise.all([
      request(app).get("/api/exercises").query({ search: "developpe" }),
      request(app).get("/api/exercises").query({ search: "DEVELOPPE" }),
      request(app).get("/api/exercises").query({ search: "développé" }),
    ]);

    expect(lower.status).toBe(200);
    expect(lower.body.total).toBe(15);
    expect(upper.body.total).toBe(15);
    expect(accented.body.total).toBe(15);

    const allItems = await getAllExercises({ search: "developpe" });
    expect(getSlugs(allItems)).toContain("seated-chest-press");
  });

  test("filtre par catégorie", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ categoryId: 5 });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(31);

    const allItems = await getAllExercises({ categoryId: 5 });
    expect(allItems).toHaveLength(31);
    expect(allItems.every((exercise) => exercise.category === "Jambes")).toBe(
      true,
    );
  });

  test("filtre par difficulté", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ difficultyId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(105);

    const slugs = getSlugs(await getAllExercises({ difficultyId: 1 }));
    expect(slugs).toContain("push-ups");
    expect(slugs).not.toContain("pull-ups");
  });

  test("filtre par équipement", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ equipmentId: 4 });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(24);

    const slugs = getSlugs(await getAllExercises({ equipmentId: 4 }));
    expect(slugs).toContain("deadlift");
    expect(slugs).not.toContain("push-ups");
  });

  test("combine plusieurs filtres en AND", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ categoryId: 5, difficultyId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(17);

    const allItems = await getAllExercises({ categoryId: 5, difficultyId: 1 });
    expect(allItems.every((exercise) => exercise.category === "Jambes")).toBe(
      true,
    );

    const slugs = getSlugs(allItems);
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
    expect(combined.body.total).toBeLessThan(searchOnly.body.total);
    expect(combined.body.total).toBe(8);
    expect(
      combined.body.items.every(
        (exercise: ExerciseItem) =>
          exercise.category === "Pectoraux" &&
          exercise.name.toLowerCase().includes("développé".toLowerCase()),
      ),
    ).toBe(true);
  });

  test("une seule valeur peut être active par famille", async () => {
    const allItems = await getAllExercises({ categoryId: 5 });

    const categories = new Set(allItems.map((exercise) => exercise.category));
    expect(categories.size).toBe(1);
    expect(categories.has("Jambes")).toBe(true);
  });

  test("la réinitialisation des filtres renvoie le catalogue complet", async () => {
    const response = await request(app).get("/api/exercises");

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(151);
  });

  test("renvoie une liste vide quand aucun exercice ne correspond", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ search: "zzzznotfound" });

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.total).toBe(0);
  });
});

describe("GET /api/exercises - pagination (US26)", () => {
  test("sans paramètre, renvoie la première page de 10 exercices", async () => {
    const response = await request(app).get("/api/exercises");

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.items).toHaveLength(10);
    expect(response.body.items[0].slug).toBe("hip-abduction");
  });

  test("la page suivante renvoie les 10 exercices d'après, sans doublon", async () => {
    const [firstPage, secondPage] = await Promise.all([
      request(app).get("/api/exercises").query({ page: 1 }),
      request(app).get("/api/exercises").query({ page: 2 }),
    ]);

    expect(secondPage.status).toBe(200);
    expect(secondPage.body.page).toBe(2);
    expect(secondPage.body.items).toHaveLength(10);
    expect(secondPage.body.items[0].slug).toBe("scissor-kicks");

    const firstSlugs = getSlugs(firstPage.body.items);
    for (const exercise of secondPage.body.items) {
      expect(firstSlugs).not.toContain(exercise.slug);
    }
  });

  test("la dernière page contient les exercices restants", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ page: 16 });

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].slug).toBe("y-t-w-raise");
  });

  test("une page après la dernière renvoie une liste vide", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ page: 17 });

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.total).toBe(151);
  });

  test("une page invalide renvoie la première page", async () => {
    for (const invalidPage of ["abc", "0", "-3", "1.5"]) {
      const response = await request(app)
        .get("/api/exercises")
        .query({ page: invalidPage });

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
      expect(response.body.items[0].slug).toBe("hip-abduction");
    }
  });

  test("les filtres s'appliquent avant la pagination", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ categoryId: 5, page: 4 });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(31);
    expect(response.body.pageCount).toBe(4);
    expect(response.body.page).toBe(4);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].category).toBe("Jambes");
  });

  test("aucun résultat : liste vide, total 0 et 0 page", async () => {
    const response = await request(app)
      .get("/api/exercises")
      .query({ search: "zzzznotfound", page: 1 });

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.total).toBe(0);
    expect(response.body.pageCount).toBe(0);
  });

  test("total et pageCount correspondent au nombre d'exercices", async () => {
    const [all, beginner, search] = await Promise.all([
      request(app).get("/api/exercises"),
      request(app).get("/api/exercises").query({ difficultyId: 1 }),
      request(app).get("/api/exercises").query({ search: "developpe" }),
    ]);

    expect(all.body.total).toBe(151);
    expect(all.body.pageCount).toBe(16);
    expect(beginner.body.total).toBe(105);
    expect(beginner.body.pageCount).toBe(11);
    expect(search.body.total).toBe(15);
    expect(search.body.pageCount).toBe(2);
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
    ).toEqual(["Débutant", "Intermédiaire", "Avancé"]);
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
