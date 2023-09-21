const log4js = require("log4js");

log4js.configure({
    appenders: {
        log: {
            type: "dateFile",
            filename: "./storage/logs/application.log",
            pattern: ".yyyy-MM-dd",
            compress: true,
            numBackups: 30,
            keepFileExt: true,
        },
    },
    categories: {
        default: { appenders: ["log"], level: "trace" },
    },
});

module.exports = log4js.getLogger("log");
