const messages = require("../../config/messages");
const { uploadImage } = require("../services/external/file");
const {
    createCourse,
    editCourseById,
    getCourseById,
    deleteCourseById,
    getAllCourse,
} = require("../services/internal/course");
const { makeQueryBuilder } = require("../services/internal/queryBuilder");
const s3Config = require("../../config/s3");

const addCourse = async (req) => {
    const data = req?.body;
    data.createdBy = req?.user?._id;
    const course = await createCourse(data);
    if (req.file) {
        const file = await uploadImage(req.file,s3Config.path.course.replace("{courseId}", course._id));
        console.log("file");
        await editCourseById(course?._id, { image: file.url });
    }
    return {
        data: course,
        message: messages.success,
    };
};

const viewCourses = async (req) => {
    const queryBuilder = makeQueryBuilder(req);
    const courses = await getAllCourse(queryBuilder);
    return {
        message: messages?.success,
        data: courses,
    };
};

const editCourse = async (req) => {
    const data = req?.body;
    var courseData = await getCourseById(req?.params?.id);
    data.image = courseData?.image;
    if (req.file) {
        const file = await uploadImage(req.file);
        data.image = file.url;
    }
    await editCourseById(req?.params?.id, data);
    return { message: messages?.success };
};

const deleteCourse = async (req) => {
    await deleteCourseById(req?.params?.id);
    return { message: messages?.success };
};

const viewCourse = async (req) => {
    const course = await getCourseById(req?.params?.id);
    return {
        data: course,
    };
};

module.exports = {
    addCourse,
    viewCourses,
    editCourse,
    deleteCourse,
    viewCourse,
};
