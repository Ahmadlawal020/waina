// const axios = require("axios");
// const Order = require("../models/Order");
// const Product = require("../models/Product");

// const verifyPaystackPayment = async (req, res) => {
//   const { reference, orderData } = req.body;

//   // Basic input validation
//   if (!reference || !orderData) {
//     return res
//       .status(400)
//       .json({ message: "Missing payment reference or order data." });
//   }

//   if (!process.env.PAYSTACK_SECRET_KEY) {
//     return res.status(500).json({
//       message: "PAYSTACK_SECRET_KEY is not set in environment variables.",
//     });
//   }

//   try {
//     // === 1. Verify transaction with Paystack ===
//     const paystackRes = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );

//     if (!paystackRes.data.status) {
//       return res.status(400).json({ message: "Failed to verify payment." });
//     }

//     const paymentData = paystackRes.data.data;

//     if (paymentData.status !== "success") {
//       return res.status(400).json({ message: "Payment was not successful." });
//     }

//     // === 2. Extract order details ===
//     const {
//       buyer,
//       items,
//       delivery,
//       paymentOnDelivery,
//       isScheduled,
//       scheduledDate,
//       scheduledTime,
//       totalAmount,
//     } = orderData;

//     // === 3. Validate items and calculate total ===
//     let totalPrice = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res
//           .status(404)
//           .json({ message: `Product not found: ${item.product}` });
//       }

//       totalPrice += product.price * item.quantity;

//       orderItems.push({
//         product: product._id,
//         quantity: item.quantity,
//       });
//     }

//     // === 4. Check for mismatch between client total and server calculated total ===
//     if (totalPrice !== totalAmount) {
//       return res.status(400).json({
//         message: `Total mismatch: expected ${totalPrice}, received ${totalAmount}`,
//       });
//     }

//     // === 5. Save Order ===
//     const newOrder = await Order.create({
//       buyer,
//       items: orderItems,
//       totalPrice,
//       delivery,
//       paymentOnDelivery: false, // paid via Paystack
//       status: "pending",
//       isScheduled,
//       scheduledDate,
//       scheduledTime,
//     });

//     // === 6. Respond with order ===
//     return res.status(200).json({
//       message: "Payment verified and order placed successfully.",
//       order: newOrder,
//     });
//   } catch (err) {
//     // === Global Catch ===
//     console.error("❌ Payment verification error:", {
//       reference,
//       error: err.message,
//       stack: err.stack,
//     });

//     return res.status(500).json({
//       message: "Payment verification failed.",
//       error: err.message || "Unknown error",
//     });
//   }
// };

// module.exports = { verifyPaystackPayment };

/////////////////////////////////////////////////////////////////////////////////

// const axios = require("axios");
// const Order = require("../models/Order");
// const Product = require("../models/Product");

// const verifyPaystackPayment = async (req, res) => {
//   const { reference, orderData } = req.body;

//   console.log("📥 Incoming request:", { reference, orderData });

//   // Basic input validation
//   if (!reference || !orderData) {
//     console.warn("⚠️ Missing reference or orderData");
//     return res
//       .status(400)
//       .json({ message: "Missing payment reference or order data." });
//   }

//   if (!process.env.PAYSTACK_SECRET_KEY) {
//     console.error("❌ PAYSTACK_SECRET_KEY is missing in environment");
//     return res.status(500).json({
//       message: "PAYSTACK_SECRET_KEY is not set in environment variables.",
//     });
//   }

//   try {
//     // === 1. Verify transaction with Paystack ===
//     console.log("🔍 Verifying payment with Paystack...");
//     const paystackRes = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );

//     console.log("✅ Paystack response received:", paystackRes.data);

//     if (!paystackRes.data.status) {
//       console.warn("⚠️ Paystack verification failed");
//       return res.status(400).json({ message: "Failed to verify payment." });
//     }

//     const paymentData = paystackRes.data.data;

//     if (paymentData.status !== "success") {
//       console.warn("⚠️ Payment not successful:", paymentData.status);
//       return res.status(400).json({ message: "Payment was not successful." });
//     }

//     // === 2. Extract order details ===
//     const {
//       buyer,
//       items,
//       delivery,
//       paymentOnDelivery,
//       isScheduled,
//       scheduledDate,
//       scheduledTime,
//       totalAmount,
//     } = orderData;

//     console.log("📦 Order data extracted", { buyer, items });

//     // === 3. Validate items and calculate total ===
//     let totalPrice = 0;
//     const orderItems = [];

//     for (const item of items) {
//       console.log("🔍 Fetching product:", item.product);
//       const product = await Product.findById(item.product);

//       if (!product) {
//         console.warn(`❌ Product not found: ${item.product}`);
//         return res
//           .status(404)
//           .json({ message: `Product not found: ${item.product}` });
//       }

//       const itemTotal = product.price * item.quantity;
//       totalPrice += itemTotal;

//       console.log(
//         `✅ Product found: ${product.name} - Quantity: ${item.quantity} - Total: ${itemTotal}`
//       );

//       orderItems.push({
//         product: product._id,
//         quantity: item.quantity,
//       });
//     }

//     console.log(
//       "💰 Total calculated:",
//       totalPrice,
//       "vs client total:",
//       totalAmount
//     );

//     // === 4. Check for mismatch between client total and server calculated total ===
//     if (totalPrice !== totalAmount) {
//       console.warn("⚠️ Total mismatch:", {
//         server: totalPrice,
//         client: totalAmount,
//       });
//       return res.status(400).json({
//         message: `Total mismatch: expected ${totalPrice}, received ${totalAmount}`,
//       });
//     }

//     // === 5. Save Order ===
//     console.log("📝 Creating order...");
//     const newOrder = await Order.create({
//       buyer,
//       items: orderItems,
//       totalPrice,
//       delivery,
//       paymentOnDelivery: false, // paid via Paystack
//       status: "pending",
//       isScheduled,
//       scheduledDate,
//       scheduledTime,
//     });

//     console.log("✅ Order saved successfully:", newOrder._id);

//     // === 6. Respond with order ===
//     return res.status(200).json({
//       message: "Payment verified and order placed successfully.",
//       order: newOrder,
//     });
//   } catch (err) {
//     // === Global Catch ===
//     console.error("❌ Payment verification error:", {
//       reference,
//       error: err.message,
//       stack: err.stack,
//     });

//     return res.status(500).json({
//       message: "Payment verification failed.",
//       error: err.message || "Unknown error",
//     });
//   }
// };

// module.exports = { verifyPaystackPayment };

//////////////////////////////////////////////////////////////////////////////////////////////////

// const axios = require("axios");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const User = require("../models/User");
// const sendSMS = require("../utils/sendSMS");

// const verifyPaystackPayment = async (req, res) => {
//   const { reference, orderData } = req.body;

//   if (!reference || !orderData) {
//     return res
//       .status(400)
//       .json({ message: "Missing payment reference or order data." });
//   }

//   if (!process.env.PAYSTACK_SECRET_KEY) {
//     return res.status(500).json({
//       message: "PAYSTACK_SECRET_KEY is not set in environment variables.",
//     });
//   }

//   try {
//     const paystackRes = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );

//     if (
//       !paystackRes.data.status ||
//       paystackRes.data.data.status !== "success"
//     ) {
//       return res.status(400).json({ message: "Payment was not successful." });
//     }

//     const paymentData = paystackRes.data.data;
//     const {
//       buyer,
//       items,
//       delivery,
//       paymentOnDelivery,
//       isScheduled,
//       scheduledDate,
//       scheduledTime,
//       totalAmount,
//     } = orderData;

//     let totalPrice = 0;
//     const orderItems = [];
//     const productDetails = [];

//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res
//           .status(404)
//           .json({ message: `Product not found: ${item.product}` });
//       }

//       const subtotal = product.price * item.quantity;
//       totalPrice += subtotal;

//       orderItems.push({
//         product: product._id,
//         quantity: item.quantity,
//       });

//       productDetails.push(`${product.name} (x${item.quantity})`);
//     }

//     if (totalPrice !== totalAmount) {
//       return res.status(400).json({
//         message: `Total mismatch: expected ${totalPrice}, received ${totalAmount}`,
//       });
//     }

//     const newOrder = await Order.create({
//       buyer,
//       items: orderItems,
//       totalPrice,
//       delivery,
//       paymentOnDelivery: false,
//       status: "pending",
//       isScheduled,
//       scheduledDate,
//       scheduledTime,
//     });

//     // ✅ Send SMS to buyer
//     const customerMessage = `
// Hi ${buyer.fullName},
// Your order was placed successfully!

// 🧾 Items:
// ${productDetails.join("\n")}

// 💰 Total: ₦${totalPrice.toLocaleString()}
// 📦 Delivery: ${delivery?.address || "N/A"}

// Thank you for shopping with us!
//     `.trim();

//     await sendSMS(buyer.phoneNumber, customerMessage);

//     // ✅ Notify admins
//     const admins = await User.find({ roles: { $in: ["Admin"] } });

//     for (const admin of admins) {
//       if (admin.phoneNumber) {
//         const adminMessage = `
// 🚨 New Order Alert!
// 👤 Buyer: ${buyer.fullName} (${buyer.phoneNumber})
// 📦 Items:
// ${productDetails.join("\n")}
// 📍 Address: ${delivery?.address || "N/A"}
// 🕒 Scheduled: ${isScheduled ? `${scheduledDate} @ ${scheduledTime}` : "No"}
// 💰 Total: ₦${totalPrice.toLocaleString()}
//         `.trim();

//         await sendSMS(admin.phoneNumber, adminMessage);
//       }
//     }

//     return res.status(200).json({
//       message: "Payment verified and order placed successfully.",
//       order: newOrder,
//     });
//   } catch (err) {
//     console.error("❌ Payment verification error:", err.message);
//     return res.status(500).json({
//       message: "Payment verification failed.",
//       error: err.message || "Unknown error",
//     });
//   }
// };

// module.exports = { verifyPaystackPayment };

//////////////////////////////////////////////////////////////////////////////////////////////////////

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

      productSummaries.push(
        `${product.name} x${item.quantity} (₦${itemTotal})`
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

    // Send SMS to customer
    await sendTermiiSMS(
      buyer.phoneNumber,
      `Your order has been received and will be processed. You will receive a notification when it is ready.`
    );

    const admins = await User.find({ roles: { $in: ["Admin"] } });

    // Notify Admins
    for (const admin of admins) {
      if (admin.phoneNumber) {
        await sendTermiiSMS(
          admin.phoneNumber,
          `A new order has been placed. Total price: ₦${totalPrice}.`
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
