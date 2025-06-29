const express = require("express");

const { verifyPaystackPayment } = require("../controllers/paystackController");

const router = express.Router();

router.post("/verify", verifyPaystackPayment);

module.exports = router;
