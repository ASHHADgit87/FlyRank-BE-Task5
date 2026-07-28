const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = connectionString ? new Pool({ connectionString }) : null;

module.exports = pool;
