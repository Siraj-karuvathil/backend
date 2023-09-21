const mongoose = require("mongoose");
const { ClassDetails } = require("../../models");

const createClass = async (data) => {
    const classData = await new ClassDetails(data).save();
    return classData;
};

const getAllClasses = async (queryBuilder, condition) => {
    let [classes, total] = await Promise.all([
        ClassDetails.find(queryBuilder.getFindQuery(condition))
            .populate("courseId")
            .select(queryBuilder.getSelectFields())
            .sort(queryBuilder.getSortQuery())
            .limit(queryBuilder.getPagination()?.limit)
            .skip(queryBuilder.getPagination()?.skip),
        ClassDetails.countDocuments(queryBuilder.getFindQuery(condition)),
    ]);
    return { classes, total };
};

const getClassById = async (classId, select = null) => {
    const id = mongoose.Types.ObjectId(classId);
    const classData = await ClassDetails.findOne({ _id: id }).populate("courseId").select(select);
    return classData;
};

const editClassById = async (classId, data) => {
    const id = mongoose.Types.ObjectId(classId);
    return await ClassDetails.updateOne({ _id: id }, { $set: data });
};

const deleteClassyId = async (classId) => {
    const id = mongoose.Types.ObjectId(classId);
    return await ClassDetails.deleteOne({ _id: id });
};

const deleteLessonById = async (data) => {
    const classId = mongoose.Types.ObjectId(data?.classId);
    const lessonId = mongoose.Types.ObjectId(data?.lessionId);
    return await ClassDetails.updateOne({ _id: classId }, { $pull: { lessons: { _id: lessonId } } });
};

module.exports = {
    createClass,
    editClassById,
    getClassById,
    deleteClassyId,
    getAllClasses,
    deleteLessonById,
};
