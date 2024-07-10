const config = require("../../config");
const { ROLE_STUDENT } = require("../../config/constants");
const messages = require("../../config/messages");
const {
	handleAuthenticate,
	handleForgotPassword,
	handleResetPassword,
	handleRefreshToken,
	handleLogout,
	handleVerifyEmail,
} = require("../services/internal/auth");
const { createUser } = require("../services/internal/user");

const login = async (req) => {
	const { headers, data } = await handleAuthenticate(req?.body, req?.headers);
	return { message: messages?.loggedIn, headers, data };
};

const signUp = async (req) => {
	const data = req?.body;
	data.role = ROLE_STUDENT;
	await createUser(data);
	return {
		message: messages?.signUpSuccess,
	};
};

const forgotPassword = async (req) => {
	await handleForgotPassword(req?.body);
	return { message: messages?.resetPasswordMailSent };
};

const resetPassword = async (req) => {
	await handleResetPassword(req?.body);
	return { message: messages?.passwordResetSuccess };
};

const refreshToken = async (req) => {
	const { headers, data } = await handleRefreshToken(req?.body, req?.headers);
	return { headers, data };
};

const logout = async (req) => {
	await handleLogout(req?.user, req?.headers);
	return { message: messages?.logoutSuccess };
};

const verifyEmail = async (req) => {
	await handleVerifyEmail(req.query.token);
	return {
		message: messages?.emailVerified,
		redirect: config.app.webUrl + "/login",
	};
};

module.exports = {
	login,
	signUp,
	forgotPassword,
	resetPassword,
	refreshToken,
	logout,
	verifyEmail,
};
