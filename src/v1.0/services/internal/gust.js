const mongoose = require("mongoose");
const { Course } = require("../../models");

const getAllCourse = async () => {
    let [courses, total] = await Promise.all([Course.find(), Course.countDocuments()]);
    return { courses, total };
};

const getCourseById = async (courseId, select = null) => {
    const id = mongoose.Types.ObjectId(courseId);
    const course = await Course.findOne({ _id: id }).select(select);
    return course;
};

module.exports = {
    getAllCourse,
    getCourseById,
};
