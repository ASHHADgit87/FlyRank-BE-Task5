const Redis = require("ioredis");

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

module.exports = redis;
