const router = require("express").Router();
const v1 = require("../v1.0/routes");
const v2 = require("../v2.0/routes");

// api version 1.0 routes
router.use("/1.0", v1);
router.use("/2.0", v2);

module.exports = router;
