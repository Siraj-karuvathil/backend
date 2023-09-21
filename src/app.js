// framework
const express = require("express");

// external packages
const helmet = require("helmet");
const cors = require("cors");

// app modules/packages/utils
const config = require("./config");
const database = require("./utils/database");
const routes = require("./routes");
const { exceptionConverter, exceptionHandler } = require("./utils/exceptions");
const { NotFoundException } = require("./utils/customExceptions");

const app = express();

// parse application/json
app.use(express.json({ limit: config?.bodyLimit ?? "" }));

// security level
app.use(helmet());
app.use(cors(config?.corsOptions));

// database connection
database.connect();

// api routes
app.use("/api", routes);

// 404 error for any unknown api request
app.use((_, res, next) => {
  next(new NotFoundException());
});

// centralized error handler
app.use(exceptionConverter);
app.use(exceptionHandler);

module.exports = app;
