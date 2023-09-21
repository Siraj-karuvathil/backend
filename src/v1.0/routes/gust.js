const router = require("express").Router();
const makeCallback = require("../../utils/callback");
const studentController = require("../controllers/gust");
const classController = require("../controllers/classDetails");

// GET  : Get all class
router.get("/class", makeCallback(classController.viewClasss));

// GET  : Get all courses
router.get("/course", makeCallback(studentController.viewCourses));

//GET : view specified course
router.get("/course/:id", makeCallback(studentController.viewCourse));

// GET  : Get specified class
router.get("/class/:id", makeCallback(classController.viewClass));

module.exports = router;
