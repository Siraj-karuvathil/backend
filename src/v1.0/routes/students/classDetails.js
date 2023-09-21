const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const classController = require("../../controllers/classDetails");

// GET  : Get all class
router.get("/", makeCallback(classController.viewClasss));

// GET  : Get specified class
router.get("/:id", makeCallback(classController.viewClass));

// GET  : Get specified class by courseId
router.get(
  "/:courseId/class",
  makeCallback(classController.viewClassByCourseId)
);

module.exports = router;
