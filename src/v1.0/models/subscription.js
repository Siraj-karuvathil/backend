module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            userId: {
                type: String,
                default: "",
            },
            itemId: {
                type: String,
                default: "",
            },
            startsAt: {
                type: Date,
            },
            endsAt: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );

    return mongoose.model("Subscription", schema, collectionName);
};
