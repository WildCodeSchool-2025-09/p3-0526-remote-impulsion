import supertest from "supertest";

import app from "../../src/app";

describe("GET /api/health", () => {
  it("reports that the API is available", async () => {
    const response = await supertest(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
