const {
    PAYMENT_TYPE_IN,
    PAYMENT_TYPE_OUT,
    STATUS_INITIATED,
    STATUS_FAILED,
    STATUS_COMPLETED,
    STATUS_CANCELLED,
} = require("../../config/constants");

module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            userId: {
                type: String,
                required: true,
            },
            orderId: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                default: 0,
            },
            type: {
                type: String,
                enum: [PAYMENT_TYPE_IN, PAYMENT_TYPE_OUT],
                default: PAYMENT_TYPE_IN,
            },
            method: {
                type: String,
                default: "",
            },
            gateway: {
                type: String,
                default: "",
            },
            transaction: {
                type: mongoose.Mixed,
            },
            status: {
                type: String,
                enum: [STATUS_INITIATED, STATUS_COMPLETED, STATUS_CANCELLED, STATUS_FAILED],
                default: STATUS_INITIATED,
            },
            completedAt: {
                type: Date,
            },
            cancelledAt: {
                type: Date,
            },
            failedAt: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );

    return mongoose.model("Payment", schema, collectionName);
};
