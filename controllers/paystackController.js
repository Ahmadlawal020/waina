const axios = require("axios");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const sendTermiiSMS = require("../utils/sendSMS"); // ✅ Uses Termii now

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
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (
      !paystackRes.data.status ||
      paystackRes.data.data.status !== "success"
    ) {
      return res.status(400).json({ message: "Payment was not successful." });
    }

    const paymentData = paystackRes.data.data;
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
    const deliveryMethod = delivery.type === "delivery" ? "Delivery" : "Pickup";

    let totalPrice = 0;
    const orderItems = [];
    const productSummaries = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
      });

      // productSummaries.push(
      //   `${product.name} x${item.quantity} (₦${itemTotal})`
      // );
      productSummaries.push(
        `${product.product} x${item.quantity} (₦${itemTotal})`
      );
    }

    if (totalPrice !== totalAmount) {
      return res.status(400).json({
        message: `Total mismatch: expected ${totalPrice}, received ${totalAmount}`,
      });
    }

    const newOrder = await Order.create({
      buyer,
      items: orderItems,
      totalPrice,
      delivery,
      paymentOnDelivery: false,
      status: "pending",
      isScheduled,
      scheduledDate,
      scheduledTime,
    });

    const orderDetails = productSummaries.join("; ");

    await sendTermiiSMS(
      buyer.phoneNumber,
      `Hello ${buyer.fullName},\nWe’ve received your order #${newOrder.orderNumber}.\nWe’ll notify you once it’s ready for pickup or delivery.\nThanks for trusting us!`
    );

    const admins = await User.find({ roles: { $in: ["Admin"] } });

    // Notify Admins
    for (const admin of admins) {
      if (admin.phoneNumber) {
        await sendTermiiSMS(
          admin.phoneNumber,
          `New Order Alert!\nCustomer: ${buyer.fullName}\nOrder Number: #${newOrder.orderNumber}\nTotal: ₦${totalPrice}\nDelivery Method: ${deliveryMethod}\nPlease log in to your dashboard to review and process the order.`
        );
      }
    }
    return res.status(200).json({
      message: "Payment verified and order placed successfully.",
      order: newOrder,
    });
  } catch (err) {
    console.error(" Payment verification error:", err.message);
    return res.status(500).json({
      message: "Payment verification failed.",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = { verifyPaystackPayment };
