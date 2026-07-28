# FlyRank BE Task 5 — Containerize Your Stack
A Postgres-backed task API built for the FlyRank Backend AI Engineering internship (BE-04). It continues directly from the in-memory CRUD service by swapping in a real Postgres repository behind the exact same interface — proving that storage is an implementation detail, not an architecture change — and runs the entire stack (app, Postgres, Redis) with a single `docker compose up`.

---

## Architecture
| Layer | Responsibility |
|---|---|
| Repositories | In-memory and Postgres implementations behind one shared interface |
| Services | Business logic and validation — untouched by the storage swap |
| Controllers | Request handling and response shaping |
| Routes | Maps CRUD + health endpoints |
| DB | Postgres, seeded via a committed `init.sql`, persisted through a named Docker volume |
| Redis | Pinged via `/health` — stretch goal, ready for Week 4's caching work |

---

## Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List tasks — filterable by `search`, `done`, sortable by `title` |
| GET | `/tasks/:id` | Fetch a single task by id |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task's title and/or completion status |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/stats` | Total, completed, and pending task counts |
| GET | `/health` | Reports live Postgres and Redis connection status |

---

## What changed vs. the in-memory version
Only `repositories/index.js` decides which repository loads, based on whether `DATABASE_URL` is set. **`services/taskService.js` and `routes/taskRoutes.js` were not touched at all** — that's the architecture proving itself, exactly as the assignment asks.

---

## Running the full stack
```bash
git clone https://github.com/ASHHADgit87/FlyRank-BE-Task5.git
cd FlyRank-BE-Task5
cp .env.example .env
docker compose up
```
This starts the app, Postgres (with a named volume), and Redis together. App: `http://localhost:5000`.

---

## Proving persistence
1. `docker compose up`
2. Create a task: `POST /tasks` with `{"title":"Persistence check"}`
3. `docker compose down` (no `-v` flag, so the volume survives) then `docker compose up` again
4. `GET /tasks` — the created task is still there, because Postgres's data directory lives in the named volume `pgdata`, not the container's writable layer. Verified via matching response content-length before and after a full stack restart, and confirmed in Postgres's own boot log: `"Database directory appears to contain a database; Skipping initialization"` — proof it recovered existing data rather than re-seeding.

---

## Stretch: Redis
`GET /health` pings both Postgres and Redis and reports connection status for each, included in `docker-compose.yml` as its own service.

## Stretch: index + EXPLAIN ANALYZE
`db/init.sql` includes `idx_tasks_title` on `tasks(title)`. Running `EXPLAIN ANALYZE` on a title search before and after adding the index shows the plan shift from a sequential scan to an index scan.

---

## Testing
```bash
npm test
```
Tests run against the in-memory repository (no `DATABASE_URL` set), so they don't require Docker or Postgres running.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Security | Helmet, CORS |
| Reliability | express-rate-limit |
| Testing | Jest, Supertest |
| Containerization | Docker, Docker Compose |

---

## Creator & Developer

**Muhammad Ashhadullah Zaheer**

LinkedIn: https://www.linkedin.com/in/muhammad-ashhadullah-zaheer-41194a340/
