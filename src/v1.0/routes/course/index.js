const router = require("express").Router();
const course = require("./course");
const classDetails = require("./classDetails");

router.use("/class", classDetails);
router.use("/", course);

module.exports = router;
