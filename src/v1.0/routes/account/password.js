const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const accountController = require("../../controllers/account");
const {
    account: {
        password: { changePasswordValidator },
    },
} = require("../../validators");

// PUT : change account password
router.put("/", changePasswordValidator, makeCallback(accountController.changePassword));

module.exports = router;
