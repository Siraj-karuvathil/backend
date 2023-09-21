const messages = require("../../config/messages");
const { BadRequestException } = require("../../utils/customExceptions");

const validateHeaders = async (headers) => {
    if (!headers["device-id"]) throw new BadRequestException(messages?.deviceIdMissing);
    if (!headers["app-type"]) throw new BadRequestException(messages?.appTypeMissing);
    return true;
};

const ensureRequestSanity = () => {
    return (req, res, next) => {
        validateHeaders(req?.headers)
            .then(() => {
                next();
            })
            .catch(next);
    };
};

module.exports = {
    ensureRequestSanity,
};
