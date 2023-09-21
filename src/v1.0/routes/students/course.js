const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const studentController = require("../../controllers/student");

// GET  : Get all courses
router.get("/", makeCallback(studentController.viewCourses));

// GET  : Get student enrolled courses
router.get("/my-course", makeCallback(studentController.viewStudentCourses));

//GET : view specified course
router.get("/:id", makeCallback(studentController.viewCourse));

module.exports = router;
