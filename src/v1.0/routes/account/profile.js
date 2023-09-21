const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const accountController = require("../../controllers/account");
const {
    account: {
        profile: { updateProfileValidator },
    },
} = require("../../validators");

// GET : view profile
router.get("/", makeCallback(accountController.viewProfile));

// PUT : update profile
router.put("/", updateProfileValidator, makeCallback(accountController.updateProfile));

module.exports = router;
