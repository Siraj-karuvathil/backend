const { checkSchema } = require("express-validator");
const messages = require("../../../config/messages");

const changePasswordValidator = () => {
    return checkSchema({
        oldPassword: { notEmpty: { errorMessage: messages?.passwordIsRequired } },
        newPassword: { notEmpty: { errorMessage: messages?.passwordIsRequired } },
        confirmPassword: {
            notEmpty: { errorMessage: messages?.confirmPasswordIsRequired, bail: true },
            custom: {
                options: (value, { req }) => {
                    return value === req?.body?.newPassword ? true : false;
                },
                errorMessage: messages?.passwordNotMatch,
            },
        },
    });
};

module.exports = (errorFormatter) => ({
    changePasswordValidator: [changePasswordValidator(), errorFormatter],
});
