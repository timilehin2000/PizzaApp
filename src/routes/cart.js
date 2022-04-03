const router = require("express").Router();
const CartController = require("../controllers/cart");
const auth = require("../helpers/validations/auth");

router.post("/cart", auth, CartController.addMenuToCart);
router.delete("/cart", auth, CartController.removeMenuItemFromCart);
router.get("/cart", auth, CartController.fetchCart);

module.exports = router;
