const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const auth = require("../helpers/validations/auth");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);
router.get("/logout", auth, UserController.logout);
router.patch("/edit", auth, UserController.editDetails);

module.exports = router;
