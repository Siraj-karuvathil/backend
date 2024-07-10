const router = require("express").Router();
const { verifyEmail } = require("../v1.0/controllers/auth");
const v1 = require("../v1.0/routes");
const v2 = require("../v2.0/routes");
const makeCallback = require("../utils/callback");

// api version 1.0 routes
router.use("/1.0", v1);
router.use("/2.0", v2);

router.get('/verify-email', makeCallback(verifyEmail));

module.exports = router;
