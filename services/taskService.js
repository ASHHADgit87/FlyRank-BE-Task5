const repository = require("../repositories");

const listTasks = async ({ search, done, sort }) => {
  let doneFilter;
  if (done !== undefined) {
    if (done !== "true" && done !== "false") {
      const err = new Error('Query param "done" must be "true" or "false"');
      err.statusCode = 400;
      throw err;
    }
    doneFilter = done === "true";
  }
  return repository.findAll({ search, done: doneFilter, sort });
};

const getTask = async (id) => {
  const task = await repository.findById(id);
  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }
  return task;
};

const createTask = async ({ title, done }) => {
  if (!title || typeof title !== "string" || !title.trim()) {
    const err = new Error("Task title is required");
    err.statusCode = 400;
    throw err;
  }
  return repository.create({ title: title.trim(), done: !!done });
};

const updateTask = async (id, { title, done }) => {
  const existing = await repository.findById(id);
  if (!existing) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }
  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    const err = new Error("Task title must be a non-empty string");
    err.statusCode = 400;
    throw err;
  }
  const newTitle = title !== undefined ? title.trim() : existing.title;
  const newDone = done !== undefined ? !!done : existing.done;
  return repository.update(id, { title: newTitle, done: newDone });
};

const deleteTask = async (id) => {
  const existing = await repository.findById(id);
  if (!existing) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }
  await repository.remove(id);
  return { id };
};

const getStats = async () => {
  const total = await repository.countAll();
  const completed = await repository.countDone();
  return { total, completed, pending: total - completed };
};

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getStats,
};
