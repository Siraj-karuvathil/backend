const { checkSchema } = require("express-validator");
const messages = require("../../../config/messages");
const { getUserByEmail } = require("../../services/internal/user");

const updateProfileValidator = async (req, res, next) => {
    const [emailExist] = await Promise.all([getUserByEmail(req?.body?.email)]);
    await checkSchema({
        username: { notEmpty: { errorMessage: messages?.nameIsRequired } },
        email: {
            notEmpty: { errorMessage: messages?.emailIsRequired, bail: true },
            isEmail: { errorMessage: messages?.emailIsInvalid, bail: true },
            custom: {
                options: () => {
                    if (!emailExist) return true;
                    return String(req.user._id) === String(emailExist._id) ? true : false;
                },
                errorMessage: messages?.emailIsUnique,
            },
        },
        location: { notEmpty: { errorMessage: messages?.locationIsRequired } },
    }).run(req);
    next();
};

module.exports = (errorFormatter) => ({
    updateProfileValidator: [updateProfileValidator, errorFormatter],
});
