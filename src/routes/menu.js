const router = require("express").Router();
const MenuController = require("../controllers/menu");
const auth = require("../helpers/validations/auth");

router.get("/menu", auth, MenuController.getAllMenu);

module.exports = router;
