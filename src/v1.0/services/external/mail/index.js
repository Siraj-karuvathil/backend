const ejs = require("ejs");
const config = require("../../../../config");
const emailSubjects = require("../../../../config/emailSubjects");
const mailConfig = require("../../../../config/mail");
const logger = require("../../../../utils/logger");
const makeTransporter = require("./transporters");

const send = async (email, subject, html = "", text = "") => {
    try {
        // create reusable transporter object
        const transporter = makeTransporter(mailConfig);
        // console.log("transporter :", transporter);
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: mailConfig?.from,
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        });
        // console.log("info :", info);
        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        logger.info(`Mail sent to ${email}. MessageID: ${info.messageId}`);
        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (error) {
        logger.info({
            message: "Mail error",
            error,
        });
    }
};

const processSubject = (template, data) => {
    let subject = emailSubjects[template] || "";
    for (const key in data) {
        if (data?.[key]) {
            const value = data[key];
            if (["number", "string"].includes(typeof value)) subject = subject.replace("{" + key + "}", value);
        }
    }

    return subject.replace("{appName}", config?.app?.name);
};

const processBody = (template, data) => {
    const templatePath = __dirname + "/../../../views/emailTemplates/" + template + ".ejs";
    return ejs.renderFile(templatePath, { ...data, config });
};

const sendEmail = async (email, template, data) => {
    // process mail content
    const subject = processSubject(template, data);
    const html = await processBody(template, data);

    // send email to {email} address
    send(email, subject, html);
};

module.exports = {
    sendEmail,
};
