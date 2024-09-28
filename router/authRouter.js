const Router = require("express");
const router = new Router();
const controller = require("../controllers/authController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", controller.profile);
router.post("/refresh-token", controller.refreshToken),
  router.get("/logout", controller.logout);
  router.get("/allUsers", controller.getAllUsers);

module.exports = router;
