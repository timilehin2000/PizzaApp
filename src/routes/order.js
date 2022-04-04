const router = require("express").Router();
const OrderController = require("../controllers/order");
const auth = require("../helpers/validations/auth");

router.post("/order", auth, OrderController.makeOrder);

module.exports = router;
