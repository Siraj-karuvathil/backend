module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                sparse: true,
                required: true,
            },
            duration: {
                type: String,
                required: true,
            },
            createdBy: {
                type: String,
            },
            image: {
                type: String,
                default: "",
            },
            instructorName: {
                type: String,
                default: "",
            },
            about: {
                type: String,
                default: "",
            },
            unit: {
                type: Number,
                default: "",
            },
            lesson: {
                type: Number,
                default: "",
            },
            task: {
                type: Number,
                default: "",
            },
            price: {
                type: Number,
                required: true,
            },
            subscriptionCount: {
                type: Number,
                default: 0,
            },
        },
        {
            timestamps: true,
        }
    );

    schema.index({ name: "text", mode: "text" });
    return mongoose.model("Course", schema, collectionName);
};
