const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const orderController = require("../../controllers/payment1");

//POST : create payment
router.post("/", makeCallback(orderController.createPayment));

module.exports = router;
