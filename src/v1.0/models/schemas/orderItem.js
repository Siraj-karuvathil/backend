const { ITEM_TYPE_COURSE } = require("../../../config/constants");

module.exports = {
    itemType: {
        type: String,
        enum: [ITEM_TYPE_COURSE],
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    amount: {
        type: Number,
        default: 0,
    },
};
