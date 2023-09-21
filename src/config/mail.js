module.exports = {
    service: process?.env?.MAIL_SERVICE,
    host: process?.env?.MAIL_HOST,
    port: process?.env?.MAIL_PORT,
    secure: process?.env?.MAIL_SECURE, // true for 465, false for other ports
    auth: {
        user: process?.env?.MAIL_USERNAME, // smtp username
        pass: process?.env?.MAIL_PASSWORD, // smtp password
    },
    from: process?.env?.MAIL_FROM, // sender address
};
