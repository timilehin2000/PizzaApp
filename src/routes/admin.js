const AdminControler = require("../controllers/admin");

const router = require("express").Router();

router.delete("/user", AdminControler.deleteAUser);
router.post("/menu", AdminControler.displayMenu);

module.exports = router;
