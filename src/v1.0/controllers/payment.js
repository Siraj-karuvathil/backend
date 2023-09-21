const messages = require("../../config/messages");
var paypal = require("paypal-rest-sdk");
const statusCode = require("../../config/statusCode");
const { getCourseById } = require("../services/internal/course");
const { getCartByUserId } = require("../services/internal/cart");
const fetch = import("node-fetch");
const { v4 } = require("uuid");
const cryptojs = require("crypto-js");

paypal.configure({
  mode: "sandbox", // or 'live'
  client_id: process.env.PAYPAL_CLEINT_ID,
  client_secret: process.env.PAYPAL_CLEINT_SECRETE,
});

const createPayment = async (req) => {
  try {
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
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:3000/api/2.0/success?UID=${userId}`,
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: cart.itemId.map((course) => {
              const storeItem = courses.get(course._id);
              return {
                name: storeItem.name,
                sku: `product-${storeItem._id}`,
                price: storeItem.price,
                currency: "USD",
                quantity: 1,
              };
            }),
          },
          amount: {
            currency: "USD",
            total: cart?.price,
          },
          description: "Your purchase of products",
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          return { error };
        } else {
          const approvalURL = payment.links.find(
            (link) => link.rel === "approval_url"
          );
          if (approvalURL) {
            resolve({ data: approvalURL.href });
          }
          reject("Approval url not found");
        }
      });
    });
  } catch (error) {
    return { error };
  }
};
module.exports = {
  createPayment,
};
