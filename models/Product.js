const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
      unique: true, // 🚨 Enforces uniqueness at the database level
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    minStock: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    minOrder: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      required: true,
    },
    status: {
      type: String,
      enum: ["instock", "low stock", "critical"],
      default: "instock",
    },
    image: {
      type: String,
      default: "",
      required: true,
    },
    packages: {
      type: [PackageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
