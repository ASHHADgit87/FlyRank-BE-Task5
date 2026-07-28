const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const logger = require("./middleware/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { successResponse, errorResponse } = require("./utils/response");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(logger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    errorResponse(res, 429, "Too many requests, please try again later"),
});
app.use(limiter);

app.get("/", (req, res) =>
  successResponse(res, 200, "FlyRank BE-04 Containerized Task API", {
    endpoints: [
      "GET /tasks",
      "GET /tasks/:id",
      "POST /tasks",
      "PUT /tasks/:id",
      "DELETE /tasks/:id",
      "GET /stats",
      "GET /health",
    ],
  }),
);

app.use(taskRoutes);
app.use(healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
