const statusCode = require("../../config/statusCode");
const { getCartByUserId } = require("../services/internal/cart");
const { v4 } = require("uuid");
const CryptoJS = require("crypto-js");
const { default: axios } = require("axios");

const createPayment = async (req) => {
  const userId = req?.user?._id;
  const cart = await getCartByUserId(userId);
  if (cart === null) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: "Cart is empty! please add items to cart.",
    };
  }
  const courses = new Map();
  await Promise.all(
    cart.itemId.map(async (course) => {
      courses.set(course?._id, course);
    })
  );
  const paymentGatewayDetails = {
    sandboxURL: "https://skipcashtest.azurewebsites.net",
    productionURL: process.env.SKIPCASH_URL,
    secretKey:
      process.env.SKIPCASH_SECRETE,
    keyId: process.env.SKIPCASH_KEY_ID,
    clientId: process.env.SKIPCASH_CLIENT_ID,
  };

  // if any parameters are removed, it should be removed from combinedData as well.
  const paymentDetails = {
    Uid: v4(),
    KeyId: paymentGatewayDetails.keyId,
    Amount: cart.price.toString(),
    FirstName: req?.user?.username,
    LastName: req?.body?.firstName,
    Phone: req?.body?.mobile,
    Email: req?.body?.email,
    Street: req?.body?.street, // required for US, UK, and Canada cards only
    City: req?.body?.city, // required for US, UK, and Canada cards only
    State: "KL", // required for US, UK, and Canada cards only
    Country: "IN", // required for US, UK, and Canada cards only
    PostalCode: req?.body?.postalCode, // required for US, UK, and Canada cards only
    TransactionId: "COOKINGACADEMY2303040001", // your internal order id
    Custom1: req?.user?._id, // optional
  };
  const combinedData = `Uid=${paymentDetails.Uid},KeyId=${paymentDetails.KeyId},Amount=${paymentDetails.Amount},FirstName=${paymentDetails.FirstName},LastName=${paymentDetails.LastName},Phone=${paymentDetails.Phone},Email=${paymentDetails.Email},Street=${paymentDetails.Street},City=${paymentDetails.City},State=${paymentDetails.State},Country=${paymentDetails.Country},PostalCode=${paymentDetails.PostalCode},TransactionId=${paymentDetails.TransactionId},Custom1=${paymentDetails.Custom1}`;

  const combinedDataHash = CryptoJS.HmacSHA256(
    combinedData,
    paymentGatewayDetails.secretKey
  );
 
  const hashInBase64 = CryptoJS.enc.Base64.stringify(combinedDataHash);
  // console.log(hashInBase64);

  try {
    const url = `${paymentGatewayDetails.productionURL}/api/v1/payments`;
    console.log(paymentDetails);
    const response = await axios.post(url, paymentDetails, {
      headers: {
        Authorization: hashInBase64,
        "Content-Type": "application/json",
      },
    });
    return { data: response.data.resultObj.payUrl };
  } catch (err) {
    console.log(err.response.data);
    return {statusCode:statusCode.BAD_REQUEST,message:err.response.data.errorMessage};
  }
};
module.exports = {
  createPayment,
};
