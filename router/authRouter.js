const Router = require("express");
const router = new Router();
const controller = require("../controllers/authController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/profile", controller.profile);
router.post("/refresh-token", controller.refreshToken),
router.post("/logout", controller.logout);
router.post("/allUsers", controller.getAllUsers);

module.exports = router;
