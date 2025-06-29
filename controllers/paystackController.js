// controllers/paystackController.ts
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

  try {
    // Verify with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = paystackRes.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({ message: "Payment not successful." });
    }

    // Create the order (you can validate again here)
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

    // Calculate and verify total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
      });
    }

    if (totalPrice !== totalAmount) {
      return res.status(400).json({ message: "Total mismatch" });
    }

    const newOrder = await Order.create({
      buyer,
      items: orderItems,
      totalPrice,
      delivery,
      paymentOnDelivery: false, // payment was made online
      status: "pending",
      isScheduled,
      scheduledDate,
      scheduledTime,
    });

    res
      .status(200)
      .json({ message: "Payment verified, order placed", order: newOrder });
  } catch (err) {
    console.error("Verification error:", err);
    res
      .status(500)
      .json({ message: "Payment verification failed", error: err.message });
  }
};

module.exports = { verifyPaystackPayment };
