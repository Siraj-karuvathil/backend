const { RoleMaster } = require("../../models");

const getRoleByName = async (name) => {
    return await RoleMaster.findOne({ name });
};

const getRoleById = async (id) => {
    return await RoleMaster.findById(id);
};

module.exports = {
    getRoleByName,
    getRoleById,
};
