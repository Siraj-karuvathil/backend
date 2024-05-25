module.exports = (nodemailer, config) =>
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config?.auth?.user,
            pass: config?.auth?.pass,
        },
    });
