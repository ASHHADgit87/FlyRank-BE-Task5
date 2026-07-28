const pool = require("../db/pool");

const toTaskObject = (row) => ({
  id: row.id,
  title: row.title,
  done: row.done,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

class PostgresTaskRepository {
  async findAll({ search, done, sort } = {}) {
    let sql = "SELECT * FROM tasks WHERE 1=1";
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND title ILIKE $${params.length}`;
    }
    if (done !== undefined) {
      params.push(done);
      sql += ` AND done = $${params.length}`;
    }

    sql += sort === "title" ? " ORDER BY title ASC" : " ORDER BY id ASC";

    const { rows } = await pool.query(sql, params);
    return rows.map(toTaskObject);
  }

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    return rows[0] ? toTaskObject(rows[0]) : null;
  }

  async create({ title, done }) {
    const { rows } = await pool.query(
      "INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *",
      [title, done],
    );
    return toTaskObject(rows[0]);
  }

  async update(id, { title, done }) {
    const { rows } = await pool.query(
      "UPDATE tasks SET title = $1, done = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [title, done, id],
    );
    return rows[0] ? toTaskObject(rows[0]) : null;
  }

  async remove(id) {
    const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1", [
      id,
    ]);
    return rowCount > 0;
  }

  async countAll() {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS count FROM tasks",
    );
    return rows[0].count;
  }

  async countDone() {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS count FROM tasks WHERE done = true",
    );
    return rows[0].count;
  }
}

module.exports = new PostgresTaskRepository();
