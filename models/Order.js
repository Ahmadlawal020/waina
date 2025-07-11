// const mongoose = require("mongoose");

// const Order = new mongoose.Schema({
//   buyer: {
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     emailAddress: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },

//   items: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//     },
//   ],

//   totalPrice: {
//     type: Number,
//     required: true,
//     min: 0,
//   },

//   delivery: {
//     type: {
//       type: String,
//       enum: ["pickup", "delivery"],
//       required: true,
//     },
//     address: {
//       type: String,
//       default: "", // Optional: Validate presence if type is 'delivery'
//     },
//     fee: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//   },

//   paymentOnDelivery: {
//     type: Boolean,
//     default: true,
//   },

//   status: {
//     type: String,
//     enum: ["pending", "preparing", "ready", "completed", "cancelled"],
//     default: "pending",
//   },

//   isScheduled: {
//     type: Boolean,
//     default: false,
//   },

//   scheduledDate: {
//     type: String,
//     default: "",
//   },

//   scheduledTime: {
//     type: String,
//     default: "",
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Order", Order);

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },

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
      default: "",
    },
    fee: {
      type: Number,
      default: 0,
      min: 0,
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

// Pre-save hook to auto-generate a unique order number
OrderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, ""); // e.g., 20250711
    const random = Math.floor(1000 + Math.random() * 9000); // random 4-digit number
    this.orderNumber = `ORD-${datePart}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
