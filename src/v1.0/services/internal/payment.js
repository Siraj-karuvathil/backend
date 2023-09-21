const { Payment } = require("../../models");

const createPayment = async (data) => {
    const payment = await new Payment(data).save();
    return payment;
};

const updatePaymentByMatch = async (match, data) => {
    return await Payment.updateOne(match, { $set: data });
};

const updatePaymentById = async (id, data) => {
    return await updatePaymentByMatch({ _id: id }, data);
};

module.exports = {
    createPayment,
    updatePaymentByMatch,
    updatePaymentById,
};
