const messages = require("../../config/messages");
const {
    createClass,
    editClassById,
    getClassById,
    deleteClassyId,
    getAllClasses,
    deleteLessonById,
} = require("../services/internal/classDetails");
const { makeQueryBuilder } = require("../services/internal/queryBuilder");

const addClass = async (req) => {
    const data = req?.body;
    data.createdBy = req?.user?._id;
    const classData = await createClass(data);
    return {
        data: classData,
        message: messages.success,
    };
};

const viewClasss = async (req) => {
    const queryBuilder = makeQueryBuilder(req);
    const classDatas = await getAllClasses(queryBuilder);
    return {
        message: messages?.success,
        data: classDatas,
    };
};

const editClass = async (req) => {
    const data = req?.body;
    await editClassById(req?.params?.id, data);
    return { message: messages?.success };
};

const deleteClass = async (req) => {
    await deleteClassyId(req?.params?.id);
    return { message: messages?.success };
};

const viewClass = async (req) => {
    const classData = await getClassById(req?.params?.id);
    return {
        data: classData,
    };
};

const viewClassByCourseId = async (req) => {
    const queryBuilder = makeQueryBuilder(req);
    const condition = { courseId: req?.params?.courseId };
    const classDatas = await getAllClasses(queryBuilder, condition);
    return {
        data: classDatas,
    };
};

const deleteLesson = async (req) => {
    await deleteLessonById(req?.body);
    return { message: messages?.deleteSubjectSuccess };
};

module.exports = {
    addClass,
    viewClasss,
    editClass,
    deleteClass,
    viewClass,
    viewClassByCourseId,
    deleteLesson,
};
