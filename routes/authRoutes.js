const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
} = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

// Auth routes

router.route("/login").post(loginLimiter, handleLogin);
router.route("/logout").post(handleLogout);
router.route("/refresh").get(handleRefreshToken);

module.exports = router;
