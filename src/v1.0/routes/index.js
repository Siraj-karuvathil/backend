const router = require("express").Router();
const account = require("./account");
const auth = require("./auth");
const course = require("./course");
const student = require("./students");
const gust = require("./gust");
const health = require("./health");
const {
  isUserAuthenticated,
  isSuperAdmin,
  isStudent,
} = require("../middlewares/authorizer");
const { ensureRequestSanity } = require("../middlewares/request");

// middleware
router.use(ensureRequestSanity());

router.use("/account", isUserAuthenticated, account);
router.use("/health", health);
router.use("/auth", auth);
router.use("/gust", gust);
router.use("/course", [isUserAuthenticated, isSuperAdmin], course);
router.use("/student", [isUserAuthenticated, isStudent], student);
module.exports = router;
