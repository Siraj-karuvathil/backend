const {
    STATUS_INITIATED,
    STATUS_CANCELLED,
    STATUS_COMPLETED,
    ORDER_ID_PREFIX,
    ODRER_ID_PAD_LENGTH,
} = require("../../config/constants");
const orderItem = require("./schemas/orderItem");

module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            userId: {
                type: String,
                default: "",
            },
            orderId: {
                type: String,
                default: "",
            },
            items: [orderItem],
            amount: {
                type: Number,
                default: 0,
            },
            status: {
                type: String,
                enum: [STATUS_INITIATED, STATUS_COMPLETED, STATUS_CANCELLED],
                default: STATUS_INITIATED,
            },
            completedAt: {
                type: Date,
            },
            cancelledAt: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );

    schema.pre("save", async function (next) {
        if (!this.isNew) return next();

        const date = new Date();
        const mm = (date.getMonth() + 1).toString().padStart(2, "0");
        const dd = date.getDate().toString().padStart(2, "0");
        const yy = date.getFullYear().toString().slice(-2);
        const orderIdStartsWith = `${ORDER_ID_PREFIX}${yy}${mm}${dd}`;

        const lastOrder = await Order.findOne({ orderId: { $regex: `${orderIdStartsWith}.*` } }).sort({
            createdAt: -1,
        });
        const lastOrderId = lastOrder?.orderId ?? null;
        const runningNumber = lastOrderId ? lastOrderId.substring(orderIdStartsWith.length) : 0;

        this.orderId = `${orderIdStartsWith}${(Number(runningNumber) + 1)
            .toString()
            .padStart(ODRER_ID_PAD_LENGTH, "0")}`;

        next();
    });
    const Order = mongoose.model("Order", schema, collectionName);
    return Order;
};
