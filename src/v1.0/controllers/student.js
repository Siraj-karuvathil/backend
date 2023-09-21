const messages = require("../../config/messages");
const { getAllCourse, getCourseById, isCourseSubscribed } = require("../services/internal/course");
const { makeQueryBuilder } = require("../services/internal/queryBuilder");
const { getSubscriptions, processSubscriptions } = require("../services/internal/subscription");

const viewCourse = async (req) => {
    const course = await getCourseById(req?.params?.id);
    const isSubscribed = await isCourseSubscribed(req?.params?.id, req?.user?._id);
    return {
        data: {
            course: {
                ...course.toObject(),
                isSubscribed,
            },
        },
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

const viewStudentCourses = async (req) => {
    const queryBuilder = makeQueryBuilder(req);
    const condition = { userId: req?.user?._id };
    const data = await getSubscriptions(queryBuilder, condition);
    const result = await Promise.all(
        data?.subscriptions
            .map(function (e) {
                return e.itemId;
            })
            .filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })
    );
    const total = result.length;
    const courses = await processSubscriptions(result);
    return {
        data: { courses, total: total },
        message: messages.success,
    };
};

module.exports = {
    viewCourses,
    viewCourse,
    viewStudentCourses,
};
