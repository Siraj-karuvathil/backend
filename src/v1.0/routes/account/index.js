const router = require("express").Router();
const password = require("./password");
const profile = require("./profile");

// routes
router.use("/change-password", password);

router.use("/profile", profile);

module.exports = router;
