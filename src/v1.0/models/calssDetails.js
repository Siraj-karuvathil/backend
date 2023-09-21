module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            chapterTitle: {
                type: String,
                sparse: true,
                required: true,
            },
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            classInfo: {
                type: String,
                required: true,
            },
            createdBy: {
                type: String,
            },
            instrecterName: {
                type: String,
                default: "",
            },
            lessons: [
                {
                    title: {
                        type: String,
                        default: "",
                    },
                    videoLink: {
                        type: String,
                        default: "",
                    },
                },
            ],
        },
        {
            timestamps: true,
        }
    );

    return mongoose.model("ClassDetails", schema, collectionName);
};
