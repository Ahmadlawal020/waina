const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      product,
      stock,
      minStock = 5,
      minOrder = 1,
      category,
      price,
      description,
      image,
      packages = [],
    } = req.body;

    if (
      !product ||
      stock === undefined ||
      !category ||
      price === undefined ||
      !description ||
      !image
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (minOrder < 1) {
      return res.status(400).json({ message: "minOrder must be at least 1" });
    }

    if (!Array.isArray(packages)) {
      return res.status(400).json({ message: "packages must be an array" });
    }

    for (const pkg of packages) {
      if (!pkg.name || typeof pkg.name !== "string" || pkg.quantity < 1) {
        return res.status(400).json({ message: "Invalid package entry" });
      }
    }

    const existing = await Product.findOne({ product });
    if (existing) {
      return res.status(409).json({ message: "Product name must be unique" });
    }

    const status =
      stock <= 0 ? "critical" : stock <= minStock ? "low stock" : "instock";

    const newProduct = await Product.create({
      product,
      stock,
      minStock,
      minOrder,
      category,
      price,
      description,
      image,
      packages,
      status,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (updates.product && updates.product !== existingProduct.product) {
      const duplicate = await Product.findOne({ product: updates.product });
      if (duplicate) {
        return res.status(409).json({ message: "Product name must be unique" });
      }
    }

    if (updates.minOrder !== undefined && updates.minOrder < 1) {
      return res.status(400).json({ message: "minOrder must be at least 1" });
    }

    if (updates.packages !== undefined) {
      if (!Array.isArray(updates.packages)) {
        return res.status(400).json({ message: "packages must be an array" });
      }
      for (const pkg of updates.packages) {
        if (!pkg.name || typeof pkg.name !== "string" || pkg.quantity < 1) {
          return res.status(400).json({ message: "Invalid package entry" });
        }
      }
    }

    const stockVal =
      updates.stock !== undefined ? updates.stock : existingProduct.stock;
    const minStockVal =
      updates.minStock !== undefined
        ? updates.minStock
        : existingProduct.minStock;

    const status =
      stockVal <= 0
        ? "critical"
        : stockVal <= minStockVal
        ? "low stock"
        : "instock";

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updates, status },
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category || typeof category !== "string") {
      return res.status(400).json({ message: "Invalid category" });
    }

    const products = await Product.find({ category: category.trim() }).lean();

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get unique product categories
const getUniqueCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getUniqueCategories,
};
