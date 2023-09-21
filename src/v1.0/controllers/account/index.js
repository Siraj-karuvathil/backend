const { handleChangePassword } = require("../../services/internal/auth");
const { getUserById, editUserById } = require("../../services/internal/user");
const messages = require("../../../config/messages");

const changePassword = async (req) => {
    await handleChangePassword(req?.user?._id, req?.body);
    return { message: messages.passwordChangeSuccess };
};

const viewProfile = async (req) => {
    const profile = await getUserById(req?.user?._id, "-password -resetPasswordToken");
    return { data: profile };
};

const updateProfile = async (req) => {
    const data = {
        username: req?.body?.username,
        email: req?.body?.email,
        location: req?.body?.location,
    };
    await editUserById({ _id: req?.user?._id }, data);
    return { message: messages.profileUpdateSuccuess };
};

module.exports = { changePassword, viewProfile, updateProfile };
