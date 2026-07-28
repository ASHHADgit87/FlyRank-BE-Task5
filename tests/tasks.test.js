const request = require("supertest");
const app = require("../app");

describe("GET /tasks", () => {
  it("returns the three seeded tasks", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(3);
  });
});

describe("POST /tasks", () => {
  it("creates a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Write tests" });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Write tests");
  });

  it("rejects a missing title", async () => {
    const res = await request(app).post("/tasks").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("PUT /tasks/:id", () => {
  it("updates a task", async () => {
    const res = await request(app).put("/tasks/1").send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.done).toBe(true);
  });

  it("returns 404 for an unknown id", async () => {
    const res = await request(app).put("/tasks/9999").send({ done: true });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /tasks/:id", () => {
  it("deletes a task", async () => {
    const created = await request(app).post("/tasks").send({ title: "Temp" });
    const id = created.body.data.id;
    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /stats", () => {
  it("returns total, completed, pending", async () => {
    const res = await request(app).get("/stats");
    expect(res.body.data).toHaveProperty("total");
    expect(res.body.data).toHaveProperty("completed");
    expect(res.body.data).toHaveProperty("pending");
  });
});
