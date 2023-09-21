const app = require("./app");

module.exports = {
    app,
    bodyLimit: "10mb",
    corsOptions: {
        exposedHeaders: ["Content-Type", "Content-Length", "Auth-Access-Token", "Auth-Refresh-Token"],
    },
    accessTokenSecret: process?.env?.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process?.env?.REFRESH_TOKEN_SECRET,
    resetPasswordTokenSecret: process?.env?.RESET_PASSWORD_TOKEN_SECRET,
    jwtTokenExpiresIn: process?.env?.JWT_TOKEN_EXPIRES_IN ?? "2d",
    jwtRefreshTokenExpiresIn: process?.env?.JWT_REFRESH_TOKEN_EXPIRES_IN ?? "4d",
    jwtResetPasswordTokenExpiresIn: process?.env?.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN ?? "15m",
};
