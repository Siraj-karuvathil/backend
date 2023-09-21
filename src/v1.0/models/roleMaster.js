const uniqueValidator = require("mongoose-unique-validator");
const messages = require("../../config/messages");

module.exports = (mongoose, collectionName) => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                unique: true,
                sparse: true,
                uniqueCaseInsensitive: true,
            },
            label: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            allowSignup: {
                type: Boolean,
                default: false,
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

    schema.plugin(uniqueValidator, { message: messages?.fieldIsUnique });

    return mongoose.model("RoleMaster", schema, collectionName);
};
