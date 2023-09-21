const data = require("../seeds/seed00002");
const { createUser } = require("../services/internal/user");

// execution function
async function execute() {
    await createUser(data);
}

module.exports = {
    execute,
};
