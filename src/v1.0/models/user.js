const {
	STATUS_ACTIVE,
	STATUS_INACTIVE,
	STATUS_SUSPENDED,
	ROLE_ADMIN,
	ROLE_TUTOR,
	ROLE_STUDENT,
	ROLE_STAFF,
	ROLE_SUPER_ADMIN,
} = require("../../config/constants");
const uniqueValidator = require("mongoose-unique-validator");
const messages = require("../../config/messages");

module.exports = (mongoose, collectionName) => {
	const schema = mongoose.Schema(
		{
			username: {
				type: String,
				required: true,
				unique: true,
				sparse: true,
				uniqueCaseInsensitive: true,
			},
			email: {
				type: String,
				unique: true,
				sparse: true,
				uniqueCaseInsensitive: true,
				default: "",
			},
			password: {
				type: String,
				default: "",
			},
			status: {
				type: String,
				enum: [STATUS_ACTIVE, STATUS_INACTIVE, STATUS_SUSPENDED],
				default: STATUS_ACTIVE,
			},
			resetPasswordToken: {
				type: String,
				default: "",
			},
			role: {
				type: String,
				enum: [
					ROLE_SUPER_ADMIN,
					ROLE_ADMIN,
					ROLE_TUTOR,
					ROLE_STUDENT,
					ROLE_STAFF,
				],
			},
			createdBy: {
				type: String,
				default: "",
			},
			address: {
				type: String,
				default: "",
			},
			city: {
				type: String,
				default: "",
			},
			state: {
				type: String,
				default: "",
			},
			countryId: {
				type: String,
				default: "",
			},
			pincode: {
				type: String,
				default: "",
			},
			gender: {
				type: String,
				default: "",
			},
			dob: {
				type: String,
			},
			location: {
				type: String,
				default: "",
			},
			designation: {
				type: String,
				default: "",
			},
			qualification: {
				type: String,
				default: "",
			},
			isVerified: {
				type: Boolean,
				default: false,
			},
		},
		{
			timestamps: true,
		}
	);
	schema.plugin(uniqueValidator, { message: messages?.fieldIsUnique });
	schema.index({
		fullname: "text",
		email: "text",
		phoneNumber: "text",
	});
	return mongoose.model("User", schema, collectionName);
};
