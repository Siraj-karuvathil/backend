const router = require("express").Router();
var paypal = require("paypal-rest-sdk");
const { addOrder } = require("../../v1.0/controllers/order");
const { getCartByUserId } = require("../../v1.0/services/internal/cart");

router.get("/success", async (req, res) => {
  console.log("vannu");
  console.log(req);
  const userId = req?.query?.custom1;
  const cart = await getCartByUserId(userId);
  const productId = [];
  await cart.itemId.map((item) => {
    productId.push(item._id);
  });
  if(req?.query?.status=="Paid"){
    addOrder(productId, userId).then((order) => {
      res.redirect(
        "https://cookingacademy.qa/payment-success" +
          `?orderId=${order.orderId}`
      );
    });
  }
});
module.exports = router;
