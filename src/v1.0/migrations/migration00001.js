const data = require("../seeds/seed00001");
const { RoleMaster } = require("../models");

// execution function
async function execute() {
    await Promise.all(
        data.map((item) => {
            new RoleMaster(item).save();
        })
    );
}

module.exports = {
    execute,
};
