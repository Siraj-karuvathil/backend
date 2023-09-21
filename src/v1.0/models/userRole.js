module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            userId: {
                type: String,
                required: true,
            },
            roleId: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                default: true,
            },
        },
        {
            timestamps: true,
        }
    );

    return mongoose.model("UserRole", schema, collectionName);
};
