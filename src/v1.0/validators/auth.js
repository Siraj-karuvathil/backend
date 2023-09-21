const { checkSchema } = require("express-validator");
const messages = require("../../config/messages");

const loginValidator = () => {
    return checkSchema({
        username: { notEmpty: { errorMessage: messages?.usernameIsRequired } },
        password: { notEmpty: { errorMessage: messages?.passwordIsRequired } },
    });
};

const forgotPasswordValidator = () => {
    return checkSchema({
        email: {
            notEmpty: { errorMessage: messages?.emailIsRequired },
            isEmail: { errorMessage: messages?.emailIsInvalid },
        },
    });
};

const resetPasswordValidator = () => {
    return checkSchema({
        newPassword: { notEmpty: { errorMessage: messages?.passwordIsRequired } },
        confirmPassword: { notEmpty: { errorMessage: messages?.confirmPasswordIsRequired } },
    });
};

module.exports = (errorFormatter) => ({
    loginValidator: [loginValidator(), errorFormatter],
    forgotPasswordValidator: [forgotPasswordValidator(), errorFormatter],
    resetPasswordValidator: [resetPasswordValidator(), errorFormatter],
});
