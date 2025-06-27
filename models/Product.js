const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
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
      default: 5, // you can set any default minimum value
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
