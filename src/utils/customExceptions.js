const messages = require("../config/messages");
const {
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    NOT_ACCEPTABLE,
    TOO_MANY_REQUESTS,
    UNAUTHORIZED_DEVICE,
} = require("../config/constants");

class CustomException extends Error {
    constructor(message) {
        super(message);
        this.name = this?.constructor?.name;
        this.isOperational = true;
    }
}

class BadRequestException extends CustomException {
    constructor(message = messages?.invalidRequest) {
        super(message);
        this.statusCode = BAD_REQUEST;
    }
}

class UnauthorizedException extends CustomException {
    constructor(message = messages.unauthorized) {
        super(message);
        this.statusCode = UNAUTHORIZED;
    }
}

class ForbiddenException extends CustomException {
    constructor(message = messages.forbidden) {
        super(message);
        this.statusCode = FORBIDDEN;
    }
}

class NotFoundException extends CustomException {
    constructor(message = messages.notFound) {
        super(message);
        this.statusCode = NOT_FOUND;
    }
}

class NotAcceptableException extends CustomException {
    constructor(message = messages.notAcceptable) {
        super(message);
        this.statusCode = NOT_ACCEPTABLE;
    }
}

class UnauthorizedDeviceException extends CustomException {
    constructor(message = messages.unauthorizedDevice) {
        super(message);
        this.statusCode = UNAUTHORIZED_DEVICE;
    }
}

class TooManyRequestsException extends CustomException {
    constructor(message = messages.tooManyRequests) {
        super(message);
        this.statusCode = TOO_MANY_REQUESTS;
    }
}

class FormValidatorException extends BadRequestException {
    constructor(errors = null, message = messages?.invalidRequest) {
        super(message);
        this.errors = errors;
    }
}

module.exports = {
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    NotAcceptableException,
    UnauthorizedDeviceException,
    TooManyRequestsException,
    FormValidatorException,
};
