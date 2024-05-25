const nodemailer = require("nodemailer");

module.exports = (config) => require(`./${config?.service ?? "default"}`)(nodemailer, config);
