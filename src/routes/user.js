const router = require("express").Router();
const UserController = require("../controllers/user");
const auth = require("../helpers/validations/auth");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);
router.get("/logout", auth, UserController.logout);
router.patch("/edit", auth, UserController.editDetails);
router.post("/checkout", auth, UserController.checkout);

module.exports = router;
