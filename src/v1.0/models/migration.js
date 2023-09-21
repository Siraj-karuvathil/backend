module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            fileName: {
                type: String,
                required: true,
            },
            batch: {
                type: Number,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

    return mongoose.model("Migration", schema, collectionName);
};
