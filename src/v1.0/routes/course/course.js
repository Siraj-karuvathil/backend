const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const courseController = require("../../controllers/course");
const { multerSingleFile } = require("../../services/external/file");

// POST : Create course
router.post("/", multerSingleFile("image"), makeCallback(courseController.addCourse));

// GET  : Get all courses
router.get("/", makeCallback(courseController.viewCourses));

// GET  : Get specified courses
router.get("/:id", makeCallback(courseController.viewCourse));

// PUT  : Edit the course
router.put("/:id", multerSingleFile("image"), makeCallback(courseController.editCourse));

// POST : Delete course
router.delete("/:id", makeCallback(courseController.deleteCourse));

module.exports = router;
