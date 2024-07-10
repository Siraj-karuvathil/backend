const jwt = require("jsonwebtoken");
const config = require("../../config");
const { STATUS_ACTIVE, YES, ROLE_SUPER_ADMIN, ROLE_STUDENT } = require("../../config/constants");
const { UnauthorizedException, ForbiddenException } = require("../../utils/customExceptions");
const { getRoleByName } = require("../services/internal/role");


// get token from authorization header
const getBearerToken = async (headers) => {
    const authHeader = headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return token;
};

const verifyResetPasswordToken = async (token) => {
    let payload;
    try {
        payload = jwt.verify(token, config?.resetPasswordTokenSecret);
    } catch (error) {
        payload = null;
    }
    if (!payload) throw new UnauthorizedException();
    const user = await getUserByMatch({ resetPasswordToken: token, email: payload?.email });
    if (!user) throw new UnauthorizedException();
    return payload;
};

const verifyAccessToken = async (token) => {
    if (!token) throw new ForbiddenException("Token is required");
    let payload;
    try {
        payload = jwt.verify(token, config?.accessTokenSecret);
    } catch (error) {
        payload = null;
    }
    if (!payload) throw new ForbiddenException("Invalid Token");
    return payload;
};

const verifyEmailVerificationToken = async (token) => {
    if (!token) throw new ForbiddenException("Token is required");
    let payload;
    try {
        payload = jwt.verify(token, config?.verificationTokenSecret);
    } catch (error) {
        payload = null;
    }
    if (!payload) throw new ForbiddenException("Invalid Token");
    return payload;
};

const verifyRefreshToken = async (token) => {
    let payload;
    try {
        payload = jwt.verify(token, config?.refreshTokenSecret);
    } catch (error) {
        payload = null;
    }
    if (!payload) throw new UnauthorizedException();
    return payload;
};

const verifyUserAccount = async (payload) => {
    const {getUserByMatch} = require("../services/internal/user")
    const user = await getUserByMatch({ _id: payload?.userId, email: payload?.email });
    if (!user) throw new UnauthorizedException();
    await verifyUserStatus(user);
    return payload;
};

const verifyUserStatus = async (user) => {
    const { status } = user;
    if (status === STATUS_ACTIVE) return true;
    throw new UnauthorizedException();
};

const verifyUserRole = async (payload) => {
    const role = await getRoleByName(payload?.role);
    if (!role) throw new UnauthorizedException();
    const {getUserRoleByMatch} = require("../services/internal/user")
    const userRole = await getUserRoleByMatch({ userId: payload?.userId, roleId: role?._id, isActive: YES });
    if (!userRole) throw new UnauthorizedException();
    return payload;
};

const verifyUserDevice = async (headers, data) => {
    const { "device-id": deviceId, "app-type": appType } = headers;
    const { userId, sessionId } = data;
    const {getUserDeviceByMatch} = require("../services/internal/user")
    const device = await getUserDeviceByMatch({
        userId,
        deviceId,
        appType,
        sessionId,
        isActive: YES,
    });
    if (!device) throw new UnauthorizedException();
    return data;
};

const setVerifiedUser = async (req, payload) => {
    req.body.email = payload?.email;
};

const setLoggedInUser = async (req, payload) => {
    const {getUserById} = require("../services/internal/user")
    
    req.user = await getUserById(payload?.userId, "-password -resetPasswordToken ");
};

const isValidResetPasswordToken = async (req, res, next) => {
    getBearerToken(req?.headers)
        .then(verifyResetPasswordToken)
        .then((payload) => setVerifiedUser(req, payload))
        .then(next)
        .catch(next);
};

const isUserAuthenticated = async (req, res, next) => {
    getBearerToken(req?.headers)
        .then(verifyAccessToken)
        .then((payload) => verifyUserAccount(payload))
        .then((payload) => verifyUserRole(payload))
        .then((payload) => verifyUserDevice(req?.headers, payload))
        .then((payload) => setLoggedInUser(req, payload))
        .then(next)
        .catch(next);
};

const isValidRefreshToken = async (req, res, next) => {
    getBearerToken(req?.headers)
        .then(verifyRefreshToken)
        .then((payload) => verifyUserDevice(req?.headers, payload))
        .then((payload) => setVerifiedUser(req, payload))
        .then(next)
        .catch(next);
};

const userHasPrivilage = async (currentRole, allowedRoles) => {
    if (!allowedRoles.includes(currentRole)) throw new UnauthorizedException();
    return true;
};

const isSuperAdmin = async (req, res, next) => {
    userHasPrivilage(req?.user?.role, [ROLE_SUPER_ADMIN])
        .then(() => {
            next();
        })
        .catch(next);
};

const isStudent = async (req, res, next) => {
    const payload = { userId: req?.user?._id, role: ROLE_STUDENT };
    verifyUserRole(payload)
        .then(() => {
            next();
        })
        .catch(next);
};

const isValidEmailValidator = async (req, res, next) => {
    const { token } = req?.query;
    if (!token) throw new UnauthorizedException();
    next();
}

module.exports = {
    isValidEmailValidator,
    isValidResetPasswordToken,
    isValidRefreshToken,
    isUserAuthenticated,
    isSuperAdmin,
    isStudent,
    verifyEmailVerificationToken,
};
