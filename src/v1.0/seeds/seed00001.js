const { ROLE_SUPER_ADMIN, ROLE_STUDENT } = require("../../config/constants");

module.exports = [
    {
        name: ROLE_SUPER_ADMIN,
        label: "Super Administrator",
        description: "Super Administrator role",
    },
    {
        name: ROLE_STUDENT,
        label: "Student",
        description: "Student role",
    },
];
