let tasks = [
  {
    id: 1,
    title: "Buy milk",
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Finish FlyRank BE-04 assignment",
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Read Postgres documentation",
    done: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let nextId = 4;

class InMemoryTaskRepository {
  async findAll({ search, done, sort } = {}) {
    let result = [...tasks];
    if (search)
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      );
    if (done !== undefined) result = result.filter((t) => t.done === done);
    result =
      sort === "title"
        ? result.sort((a, b) => a.title.localeCompare(b.title))
        : result.sort((a, b) => a.id - b.id);
    return result;
  }

  async findById(id) {
    return tasks.find((t) => t.id === id) || null;
  }

  async create({ title, done }) {
    const task = {
      id: nextId++,
      title,
      done: !!done,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  }

  async update(id, { title, done }) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;
    task.title = title;
    task.done = done;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  async remove(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }

  async countAll() {
    return tasks.length;
  }

  async countDone() {
    return tasks.filter((t) => t.done).length;
  }
}

module.exports = new InMemoryTaskRepository();
