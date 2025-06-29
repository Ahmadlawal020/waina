const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc Create a new order
// @route POST /orders
// @access Public
const createOrder = async (req, res) => {
  try {
    const { buyer, items, delivery, paymentOnDelivery } = req.body;

    // Basic validation
    if (
      !buyer?.fullName ||
      !buyer?.phoneNumber ||
      !buyer?.emailAddress ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !delivery?.type ||
      (delivery.type === "delivery" && !delivery.address)
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate each product and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid product data." });
      }

      const product = await Product.findById(item.product).lean();
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      // Update inventory (optional step)
      // await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
      });
    }

    const newOrder = await Order.create({
      buyer,
      items: orderItems,
      totalPrice,
      delivery,
      paymentOnDelivery,
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// // @desc Get all orders
// // @route GET /orders
// // @access Private (Admin)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("items.product", "product price image") // optional
//       .lean();

//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// @desc Get all orders (with optional status filter)
// @route GET /orders?status=completed
// @access Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      const allowedStatuses = [
        "pending",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }

      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("items.product", "product price image")
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get order by ID
// @route GET /orders/:id
// @access Private (Admin or user with order info)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id)
      .populate("items.product", "product price image")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update order status
// @route PATCH /orders/:id
// @access Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
