const router = require("express").Router();
const makeCallback = require("../../../utils/callback");
const studentController = require("../../controllers/cart");

// POST  : Add to cart
router.post("/", makeCallback(studentController.addToCart));

// Get  : get all from cart
router.get("/", makeCallback(studentController.getAllFromCart));

// DELETE  : Remove from cart
router.delete("/", makeCallback(studentController.removeFromCart));

module.exports = router;
