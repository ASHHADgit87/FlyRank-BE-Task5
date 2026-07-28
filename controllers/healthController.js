const pool = require("../db/pool");
const redis = require("../redis/client");
const { successResponse } = require("../utils/response");

const getHealth = async (req, res) => {
  const health = { status: "ok", db: "unknown", redis: "unknown" };

  try {
    if (pool) {
      await pool.query("SELECT 1");
      health.db = "connected";
    } else {
      health.db = "not configured";
    }
  } catch (err) {
    health.db = "error";
  }

  try {
    if (redis) {
      await redis.ping();
      health.redis = "connected";
    } else {
      health.redis = "not configured";
    }
  } catch (err) {
    health.redis = "error";
  }

  return successResponse(res, 200, "Health check", health);
};

module.exports = { getHealth };
