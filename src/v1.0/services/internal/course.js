const mongoose = require("mongoose");
const { Course, Subscription } = require("../../models");

const createCourse = async (data) => {
    const course = await new Course(data).save();
    return course;
};

const getAllCourse = async (queryBuilder, condition) => {
    let [courses, total] = await Promise.all([
        Course.find(queryBuilder.getFindQuery(condition))
            .select(queryBuilder.getSelectFields())
            .sort(queryBuilder.getSortQuery())
            .limit(queryBuilder.getPagination()?.limit)
            .skip(queryBuilder.getPagination()?.skip),
        Course.countDocuments(queryBuilder.getFindQuery(condition)),
    ]);
    return { courses, total };
};

const getCourseById = async (courseId, select = null) => {
    const id = mongoose.Types.ObjectId(courseId);
    const course = await Course.findOne({ _id: id }).select(select);
    return course;
};

const getCoursesById = async (courseIds, select = null) => {
    const ids = courseIds.map(id => mongoose.Types.ObjectId(id));
    const courses = await Course.find({ _id: {
        $in: ids,
    } }).select(select);
    return courses;
}

const editCourseById = async (courseId, data) => {
    const id = mongoose.Types.ObjectId(courseId);
    return await Course.updateOne({ _id: id }, { $set: data });
};

const deleteCourseById = async (courseId) => {
    const id = mongoose.Types.ObjectId(courseId);
    return await Course.deleteOne({ _id: id });
};

const isCourseSubscribed = async (courseId, userId) => {
    const data = await Subscription.findOne({ itemId: courseId, userId: userId });
    return data ? true : false;
};

module.exports = {
    createCourse,
    getAllCourse,
    editCourseById,
    deleteCourseById,
    getCourseById,
    isCourseSubscribed,
    getCoursesById,
};
