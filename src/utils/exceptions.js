const { Error: MongoError } = require("mongoose");
const messages = require("../config/messages");
const { INTERNAL_SERVER_ERROR } = require("../config/statusCode");
const { FormValidatorException } = require("./customExceptions");
const logger = require("./logger");

const exceptionConverter = (error, _, res, next) => {
    let { errors = null } = error;
    if (error instanceof MongoError.ValidationError) {
        error = new FormValidatorException(
            Object.keys(errors).reduce((acc, key) => ((acc[key] = errors[key]?.message), acc), {})
        );
    }
    next(error);
};

const exceptionHandler = (error, _, res, next) => {
    console.log(error);
    let { statusCode = 500, message, errors = null, isOperational = false } = error;
    if (!isOperational) {
        statusCode = INTERNAL_SERVER_ERROR;
        message = messages.internalServerError;
    }

    logger.error({
        message: `Exception Handler`,
        error,
    });

    let response = {
        statusCode,
        message,
        ...(errors && { errors }),
        ...(process?.env?.NODE_ENV === "development" && { stack: error.stack }),
    };

    res.status(statusCode).send(response);
};

module.exports = {
    exceptionConverter,
    exceptionHandler,
};
