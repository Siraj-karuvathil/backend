module.exports = {
    name: process?.env?.APP_NAME ?? "Coocking-Academy",
    webUrl: process?.env?.WEB_URL ?? "",
    backendUrl: process?.env?.BACKEND_URL ?? "",
    passwordRecoveryUrl: process?.env?.PASSWORD_RECOVERY_URL ?? "",
    helpEmail: process?.env?.HELP_EMAIL ?? "",
};
