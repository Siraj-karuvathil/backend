const config = require("../../../config");
const {
	EMAIL_SIGNUP_COMPLETED,
	EMAIL_PASSWORD_CHANGED,
	EMAIL_RESET_PASSWORD,
	EMAIL_ORDER_CONFIRMED,
	EMAIL_CONTACT_US,
	EMAIL_ASDA_STUDENT_LOGIN_CREDENTIAL,
} = require("../../../config/constants");
const { sendEmail } = require("../external/mail");

const sendSignUpCompletedEmail = async (email, { user, verificationToken }) => {
	sendEmail(email, EMAIL_SIGNUP_COMPLETED, {
		name: user?.firstName,
		verificationToken,
		appName: config.app.name,
        backendUrl: config.app.backendUrl,
	});
};

//Sending ASDA admissiion Student Login credentials
const sendAsdaStudentLoginCredentialsEmail = async (email, { data }) => {
	sendEmail(email, EMAIL_ASDA_STUDENT_LOGIN_CREDENTIAL, {
		name: data?.firstName,
		email: data?.email,
		password: data?.password,
	});
};

const sendResetPasswordLinkEmail = async (
	email,
	{ user, resetPasswordLink }
) => {
	sendEmail(email, EMAIL_RESET_PASSWORD, {
		name: user?.firstName,
		resetPasswordLink,
	});
};

const sendResetPasswordSuccessEmail = async (email, { user }) => {
	sendEmail(email, EMAIL_PASSWORD_CHANGED, { name: user?.firstName });
};

const sendOrderSuccessEmail = async (email, { user, order }) => {
	sendEmail(email, EMAIL_ORDER_CONFIRMED, {
		name: user?.firstName,
		orderId: order.orderId,
		items: order.items,
		amount: order.amount,
	});
};

const sendContactUsEmail = async (email, data) => {
	sendEmail(email, EMAIL_CONTACT_US, {
		name: data?.name,
		email: data?.email,
		phone: data?.phone,
		subject: data?.subject,
		message: data?.message,
	});
};

module.exports = {
	sendSignUpCompletedEmail,
	sendResetPasswordLinkEmail,
	sendResetPasswordSuccessEmail,
	sendOrderSuccessEmail,
	sendContactUsEmail,
	sendAsdaStudentLoginCredentialsEmail,
};
