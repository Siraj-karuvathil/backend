const router = require("express").Router();
const makeCallback = require("../../utils/callback");
const authController = require("../controllers/auth");
const { isUserAuthenticated } = require("../middlewares/authorizer");
const {
    auth: { loginValidator },
} = require("../validators");
const {
    user: { signUpValidator },
} = require("../validators");

// POST : login
router.post("/login", loginValidator, makeCallback(authController.login));

// POST : signup
router.post("/signup", signUpValidator, makeCallback(authController.signUp));

// POST : logout
router.post("/logout", isUserAuthenticated, makeCallback(authController.logout));

module.exports = router;
