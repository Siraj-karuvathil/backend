const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("../config/mongo");
const { runMigrations } = require("../v1.0/migrations");

// success handler
const dbConnectionSuccess = () => {
    console.log(`Connected to mongo database`);
    logger.info(`Connected to mongo database`);
};

// error handler
const dbConnectionError = (error = "") => {
    console.log(error);
    console.log(`Could not connect to mongo database`);
    logger.error({
        message: `Could not connect to mongo database`,
        error,
    });
};

// connect database
const connect = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config?.username ?? "",
        pass: config?.password ?? "",
        dbName: config?.dbName ?? "",
    };

    // connecting to mongo database
    mongoose.connect(config?.url, options).then(dbConnectionSuccess).then(runMigrations).catch(dbConnectionError);
};

module.exports = {
    connect,
};
