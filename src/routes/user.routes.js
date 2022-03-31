const router = require("express").Router();
const UserController = require("../controllers/user.controller");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);

module.exports = router;
