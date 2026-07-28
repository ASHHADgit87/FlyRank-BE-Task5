const service = require("../services/taskService");
const { successResponse, errorResponse } = require("../utils/response");

const parseId = (req, res) => {
  const parsedId = Number(req.params.id);
  if (Number.isNaN(parsedId)) {
    errorResponse(res, 400, "Task id must be a number");
    return null;
  }
  return parsedId;
};

const getTasks = async (req, res) => {
  const tasks = await service.listTasks(req.query);
  return successResponse(res, 200, "Tasks retrieved successfully", tasks, {
    count: tasks.length,
  });
};

const getTaskById = async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const task = await service.getTask(id);
  return successResponse(res, 200, "Task retrieved successfully", task);
};

const createTask = async (req, res) => {
  const task = await service.createTask(req.body);
  return successResponse(res, 201, "Task created successfully", task);
};

const updateTask = async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const task = await service.updateTask(id, req.body);
  return successResponse(res, 200, "Task updated successfully", task);
};

const deleteTask = async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const result = await service.deleteTask(id);
  return successResponse(res, 200, "Task deleted successfully", result);
};

const getStats = async (req, res) => {
  const stats = await service.getStats();
  return successResponse(res, 200, "Stats retrieved successfully", stats);
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats,
};
