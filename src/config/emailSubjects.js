const { EMAIL_SIGNUP_COMPLETED, EMAIL_RESET_PASSWORD, EMAIL_PASSWORD_CHANGED } = require("./constants");

module.exports = {
    [EMAIL_SIGNUP_COMPLETED]: "Welcome to {appName} !! Your registration has been completed.",
    [EMAIL_RESET_PASSWORD]: "Reset your {appName} password",
    [EMAIL_PASSWORD_CHANGED]: "Your {appName} password has been changed",
};
