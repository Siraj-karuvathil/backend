const bcrypt = require("bcrypt");
const {
	NotFoundException,
	BadRequestException,
} = require("../../../utils/customExceptions");
const config = require("../../../config");
const {
	STATUS_SUSPENDED,
	ROUTE_RESET_PASSWORD,
	STATUS_ACTIVE,
	NO,
	YES,
} = require("../../../config/constants");
const messages = require("../../../config/messages");

const { getRoleById } = require("./role");
const {
	generateJwtToken,
	generatePasswordHash,
	generateUUID,
} = require("../../helpers/string");
const {
	sendResetPasswordLinkEmail,
	sendResetPasswordSuccessEmail,
} = require("./email");
const {
	verifyEmailVerificationToken,
} = require("../../middlewares/authorizer");

// compare the input username with email/phoneNumber/username & isArchived should be false
const authenticateUser = async (username) => {
    const {getUserByMatch} = require("./user");
	const user = await getUserByMatch({ username: username });
	if (!user) throw new NotFoundException(messages?.invalidEmailPass);
	return user;
};

const validatePassword = async (inputPassword, encryptedPassword) => {
	const validPass = await bcrypt.compare(
		inputPassword,
		encryptedPassword || ""
	);
	if (!validPass) throw new NotFoundException(messages?.invalidEmailPass);
	return true;
};

const validateChangePassword = async (inputPassword, encryptedPassword) => {
	const validPass = await bcrypt.compare(
		inputPassword,
		encryptedPassword || ""
	);
	if (!validPass) throw new NotFoundException(messages?.invalidPassword);
	return true;
};

const checkUserStatus = async (user) => {
	const { status, isArchived } = user;
	if (isArchived) throw new NotFoundException(messages?.userNotFound);
	if (status === STATUS_ACTIVE) return true;
	if (status === STATUS_SUSPENDED)
		throw new NotFoundException(messages?.suspendedAccount);
	throw new NotFoundException(messages?.inactiveAccount);
};

const getActiveRole = async (user) => {
	const {getUserRoleByMatch} = require("./user");
	const userRole = await getUserRoleByMatch({
		userId: user._id,
		isActive: YES,
	});
	if (!userRole) throw new NotFoundException(messages?.hasNoRole);
	const role = await getRoleById(userRole.roleId);
	if (!role) throw new NotFoundException(messages?.hasNoRole);
	return role;
};

const generatePayload = async (user, role) => {
	return {
		userId: user?.id,
		role: role?.name,
		email: user?.email,
		sessionId: await generateUUID(),
	};
};

const generateAccessToken = async (payload) => {
	return generateJwtToken(payload, config?.accessTokenSecret, {
		expiresIn: config?.jwtTokenExpiresIn,
	});
};

const getUserVerificationToken = (userId) => {
	return generateJwtToken({ userId }, config?.verificationTokenSecret, {
		expiresIn: config?.verificationTokenExpiresIn,
	});
};

const generateRefreshToken = async (payload, headers) => {
	const { userId, sessionId } = payload;
	const { "device-id": deviceId = "", "app-type": appType = "" } = headers;
	const refreshToken = await generateJwtToken(
		payload,
		config?.refreshTokenSecret,
		{
			expiresIn: config?.jwtRefreshTokenExpiresIn,
		}
	);
	const deviceData = {
		userId,
		deviceId,
		appType,
		sessionId,
		refreshToken,
		isActive: YES,
	};
	const {createOrUpdateUserDevice} = require("./user");

	await createOrUpdateUserDevice(deviceData);
	return refreshToken;
};

const generateTokens = async (payload, headers) => {
	// const [accessToken, refreshToken] = await Promise.all([
	const accessToken = await generateAccessToken(payload);
	const refreshToken = await generateRefreshToken(payload, headers);

	// ]);
	return { accessToken, refreshToken };
};

const getProfile = async (userId) => {
	const {getUserById} = require("./user");
	return await getUserById(userId, "name username email phoneNumber");
};

const generateResetPasswordToken = async (payload) => {
	return generateJwtToken(payload, config?.resetPasswordTokenSecret, {
		expiresIn: config?.jwtResetPasswordTokenExpiresIn,
	});
};

const generateResetPasswordLink = (resetPasswordJwtToken) => {
	let link = `${config?.app?.passwordRecoveryUrl}${ROUTE_RESET_PASSWORD}`;
	return link.replace("{token}", resetPasswordJwtToken);
};

const sendResetPasswordLink = async (user) => {
	const resetPasswordToken = await generateResetPasswordToken({
		email: user?.email,
	});
	user.resetPasswordToken = resetPasswordToken;
	await user.save();

	// send reset password link
	sendResetPasswordLinkEmail(user?.email, {
		user,
		resetPasswordLink: generateResetPasswordLink(resetPasswordToken),
	});
};

const validateResetPassword = (data) => {
	if (data?.newPassword !== data?.confirmPassword) return false;
	return true;
};

const logoutFromUserDevice = async (user, headers) => {
	const { "device-id": deviceId = "", "app-type": appType = "" } = headers;
	const {updateUserDeviceByMatch} = require("./user");
	
	await updateUserDeviceByMatch(
		{
			userId: user?._id,
			deviceId,
			appType,
		},
		{ isActive: NO }
	);
	return true;
};

const generateTokenHeaders = ({ accessToken, refreshToken }) => {
	return {
		"Auth-Access-Token": accessToken,
		"Auth-Refresh-Token": refreshToken,
	};
};

const handleAuthenticate = async (data, headers) => {
	const user = await authenticateUser(data?.username);
	await validatePassword(data?.password, user?.password);
	await checkUserStatus(user);
	const role = await getActiveRole(user);
	const payload = await generatePayload(user, role);
	const tokens = await generateTokens(payload, headers);
	const profile = await getProfile(payload?.userId);
	if(!user.isVerified) {
		throw new BadRequestException(messages.notVerified);
	}
	return {
		headers: generateTokenHeaders(tokens),
		data: { role: payload?.role, profile },
	};
};

const handleForgotPassword = async (data) => {
	const user = await authenticateByEmail(data?.email);
	await checkUserStatus(user);
	await sendResetPasswordLink(user);
};

const handleResetPassword = async (data) => {
	const validated = validateResetPassword(data);
	if (!validated) throw new BadRequestException();
	const {getUserByEmail} = require("./user");

	const user = await getUserByEmail(data?.email);
	user.password = await generatePasswordHash(data?.newPassword);
	user.resetPasswordToken = "";
	await user.save();

	// send password changed mail
	sendResetPasswordSuccessEmail(user?.email, { user });
};

const handleRefreshToken = async (data, headers) => {
	const {getUserByEmail} = require("./user");

	const user = await getUserByEmail(data?.email);
	await checkUserStatus(user);
	const role = await getActiveRole(user);
	const payload = await generatePayload(user, role);
	const tokens = await generateTokens(payload, headers);
	return { headers: generateTokenHeaders(tokens) };
};

const handleLogout = async (user, headers) => {
	await logoutFromUserDevice(user, headers);
	return true;
};

const handleChangePassword = async (id, data) => {
	const {getUserById} = require("./user");

	const user = await getUserById(id);
	await validateChangePassword(data?.oldPassword, user.password);
	user.password = await generatePasswordHash(data?.newPassword);
	await user.save();
};

const authenticateByEmail = async (email) => {
	const {getUserByEmail} = require("./user");

	const user = await getUserByEmail(email);
	if (!user) throw new NotFoundException(messages?.userNotFound);
	return user;
};

const handleVerifyEmail = async (token) => {
	const payload = await verifyEmailVerificationToken(
		token,
		config?.verificationTokenSecret
	);
	const _userService = require("./user");
	const user = await _userService.getUserById(payload?.userId);
	if(user.isVerified) {
        throw new BadRequestException(messages?.emailAlreadyVerified);
    }
    user.isVerified = true;
	await user.save();
};

module.exports = {
	handleAuthenticate,
	handleForgotPassword,
	handleResetPassword,
	handleRefreshToken,
	handleLogout,
	handleChangePassword,
	authenticateByEmail,
	getUserVerificationToken,
	handleVerifyEmail,
};
