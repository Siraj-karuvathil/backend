const statusCode = require("../../config/statusCode");
const { getCartByUserId } = require("../services/internal/cart");
const { v4 } = require("uuid");
const CryptoJS = require("crypto-js");
const { default: axios } = require("axios");

const createPayment = async (req) => {
  // console.log(req?.user);
  // console.log(req?.body);
  // console.log(req?.headers);
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
    productionURL: "https://api.skipcash.app",
    secretKey:
      "PMyNze/nE9ueQXN1tedX/uck3Pf55uu7F3TJoNQ6tHLGcc216KFuoEpG2/6gzU5NOpM+qWlW4AjsKSndCoJHzUBkE9YMSEnqZbhr3A9wcIvgP4SMTfvTKhB9hHBROuOa5POlwgVMNXr5QbvHFFYt3Gh7sIFs3mcFr0RYh3TurtcdSfSBVpAAydtA7+0Vj36ljf1/DOKnUsKUbxLmkRSVaV4jQe4BpU5RQ2PbqJD4gq/QIUsLu5g9bnHnBoKapo9i9vS9kBKWwaYEultBPTgh8pTjzyAFZsdJaG1LF2p751LxmilpbsHiEDE7G02H3zwg3qorGPGqT0dhWcH96yn3Ch6oOJYcbm4DkRlEbvUB+auV3DPxE6aXSt9xPDcJKhPCePhUkfZS4cfadUKrzW2uAq2Jw/a6mfvchXJOdbAYMc/2r86lhx0wrgqR+9oBqh/Rg/BP+cLM8fRxT9W2DyWAdkchUMimtP1Tm+UvjaTPlEQKq3P88EpwC6rzLhukihkxce9AaQhjVUT56wA78ybPcQ==",
    keyId: "a7482a05-9475-4f52-a923-e5184db7a250",
    clientId: "7d574805-bbd1-4f52-8526-0838625708d0",
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
    const url = `${paymentGatewayDetails.sandboxURL}/api/v1/payments`;
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
