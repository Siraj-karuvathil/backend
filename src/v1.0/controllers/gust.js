const messages = require("../../config/messages");
const { getAllCourse, getCourseById } = require("../services/internal/gust");

const viewCourse = async (req) => {
    const course = await getCourseById(req?.params?.id);
    return {
        data: {
            course: {
                ...course.toObject(),
            },
        },
    };
};

const viewCourses = async () => {
    const courses = await getAllCourse();
    return {
        message: messages?.success,
        data: courses,
    };
};

module.exports = {
    viewCourses,
    viewCourse,
};
