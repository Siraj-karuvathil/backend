module.exports = (nodemailer, config) =>
    nodemailer.createTransport({
        host: config?.host,
        port: config?.port,
        secure: config?.secure, // true for 465, false for other ports
        auth: {
            user: config?.auth?.user,
            pass: config?.auth?.pass,
        },
    });
