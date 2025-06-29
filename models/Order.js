const mongoose = require("mongoose");

const Order = new mongoose.Schema({
  buyer: {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
    },
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  delivery: {
    type: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    address: {
      type: String,
      default: "", // Optional: Validate presence if type is 'delivery'
    },
  },

  paymentOnDelivery: {
    type: Boolean,
    default: true,
  },

  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "completed", "cancelled"],
    default: "pending",
  },

  isScheduled: {
    type: Boolean,
    default: false,
  },

  scheduledDate: {
    type: String,
    default: "",
  },

  scheduledTime: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", Order);
