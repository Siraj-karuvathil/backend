module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            userId: {
                type: String,
                required: true,
            },
            deviceId: {
                type: String,
                default: "",
            },
            appType: {
                type: String,
                default: "",
            },
            fcmToken: {
                type: String,
                default: "",
            },
            sessionId: {
                type: String,
                default: "",
            },
            refreshToken: {
                type: String,
                default: "",
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

    return mongoose.model("UserDevice", schema, collectionName);
};
