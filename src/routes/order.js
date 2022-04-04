const router = require("express").Router();
const OrderController = require("../controllers/order");
const auth = require("../helpers/validations/auth");

router.post("/order", auth, OrderController.makeOrder);
router.post("/order/pay", auth, OrderController.initializePayment);
router.post("/order/complete", auth, OrderController.completePayment);

module.exports = router;
