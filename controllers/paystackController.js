const axios = require("axios");

const Order = require("../models/Order");
const Product = require("../models/Product");

const verifyPaystackPayment = async (req, res) => {
  const { reference, orderData } = req.body;

  if (!reference || !orderData) {
    return res
      .status(400)
      .json({ message: "Missing payment reference or order data." });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return res.status(500).json({
      message: "PAYSTACK_SECRET_KEY is not set in environment variables.",
    });
  }

  try {
    // 1. Verify payment with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!paystackRes.data.status) {
      return res.status(400).json({ message: "Failed to verify payment." });
    }

    const paymentData = paystackRes.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({ message: "Payment was not successful." });
    }

    // 2. Extract order data
    const {
      buyer,
      items,
      delivery,
      paymentOnDelivery,
      isScheduled,
      scheduledDate,
      scheduledTime,
      totalAmount,
    } = orderData;

    // 3. Calculate total and prepare order items
    let totalPrice = 0;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error("Product not found: " + item.product);
        }

        totalPrice += product.price * item.quantity;

        return {
          product: product._id,
          quantity: item.quantity,
        };
      })
    );

    // 4. Check for total mismatch
    if (totalPrice !== totalAmount) {
      return res.status(400).json({
        message:
          "Total mismatch: calculated amount does not match provided total.",
      });
    }

    // 5. Create the order
    const newOrder = await Order.create({
      buyer,
      items: orderItems,
      totalPrice,
      delivery,
      paymentOnDelivery: false, // Payment made online
      status: "pending",
      isScheduled,
      scheduledDate,
      scheduledTime,
    });

    return res.status(200).json({
      message: "Payment verified and order placed successfully.",
      order: newOrder,
    });
  } catch (err) {
    console.error("Payment verification error:", {
      reference,
      error: err.message || err,
    });

    return res.status(500).json({
      message: "Payment verification failed.",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = { verifyPaystackPayment };

// controllers/paystackController.js
const axios = require("axios");
const Order = require("../models/Order");
const Product = require("../models/Product");

const verifyPaystackPayment = async (req, res) => {
  const { reference, orderData } = req.body;

  // Basic input validation
  if (!reference || !orderData) {
    return res
      .status(400)
      .json({ message: "Missing payment reference or order data." });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return res.status(500).json({
      message: "PAYSTACK_SECRET_KEY is not set in environment variables.",
    });
  }

  try {
    // === 1. Verify transaction with Paystack ===
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!paystackRes.data.status) {
      return res.status(400).json({ message: "Failed to verify payment." });
    }

    const paymentData = paystackRes.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({ message: "Payment was not successful." });
    }

    // === 2. Extract order details ===
    const {
      buyer,
      items,
      delivery,
      paymentOnDelivery,
      isScheduled,
      scheduledDate,
      scheduledTime,
      totalAmount,
    } = orderData;

    // === 3. Validate items and calculate total ===
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
      });
    }

    // === 4. Check for mismatch between client total and server calculated total ===
    if (totalPrice !== totalAmount) {
      return res.status(400).json({
        message: `Total mismatch: expected ${totalPrice}, received ${totalAmount}`,
      });
    }

    // === 5. Save Order ===
    const newOrder = await Order.create({
      buyer,
      items: orderItems,
      totalPrice,
      delivery,
      paymentOnDelivery: false, // paid via Paystack
      status: "pending",
      isScheduled,
      scheduledDate,
      scheduledTime,
    });

    // === 6. Respond with order ===
    return res.status(200).json({
      message: "Payment verified and order placed successfully.",
      order: newOrder,
    });
  } catch (err) {
    // === Global Catch ===
    console.error("❌ Payment verification error:", {
      reference,
      error: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      message: "Payment verification failed.",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = { verifyPaystackPayment };
