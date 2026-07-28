const useDatabase = !!process.env.DATABASE_URL;

module.exports = useDatabase
  ? require("./postgresTaskRepository")
  : require("./inMemoryTaskRepository");
