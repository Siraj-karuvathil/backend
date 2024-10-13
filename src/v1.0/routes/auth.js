const router = require("express").Router();
const makeCallback = require("../../utils/callback");
const authController = require("../controllers/auth");
const { isUserAuthenticated } = require("../middlewares/authorizer");
const {
    auth: { loginValidator, resetPasswordValidator, forgotPasswordValidator },
} = require("../validators");
const {
    user: { signUpValidator },
} = require("../validators");

// POST : login
router.post("/login", loginValidator, makeCallback(authController.login));

// POST : signup
router.post("/signup", signUpValidator, makeCallback(authController.signUp));


// POST : forgot password
router.post("/forgot-password", forgotPasswordValidator, makeCallback(authController.forgotPassword));

// POST : validate reset password request
router.post(
    "/reset-password/validate",
    // isValidResetPasswordToken,
    makeCallback(async () => ({}))
);

// POST : reset password
router.post(
    "/reset-password",
    // isValidResetPasswordToken,
    resetPasswordValidator,
    makeCallback(authController.resetPassword)
);

// POST : logout
router.post("/logout", isUserAuthenticated, makeCallback(authController.logout));

module.exports = router;
