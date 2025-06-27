// const Product = require("../models/Product");
// const mongoose = require("mongoose");

// // @desc Get all products
// // @route GET /products
// // @access Private
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().lean();

//     if (!products.length) {
//       return res.status(404).json({ message: "No products found" });
//     }

//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // @desc Get a single product by ID
// // @route GET /products/:id
// // @access Private
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     const product = await Product.findById(id).lean();

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(product);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // @desc Create a new product
// // @route POST /products
// // @access Private (Admin or Manager)
// const createProduct = async (req, res) => {
//   try {
//     const { product, stock, category, price, description, image, status } =
//       req.body;

//     if (
//       !product ||
//       stock === undefined ||
//       !category ||
//       price === undefined ||
//       !description ||
//       !image
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided" });
//     }

//     const newProduct = await Product.create({
//       product,
//       stock,
//       category,
//       price,
//       description,
//       image,
//       status,
//     });

//     res
//       .status(201)
//       .json({ message: "Product created successfully", product: newProduct });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // @desc Update a product
// // @route PATCH /products/:id
// // @access Private (Admin or Manager)
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({
//       message: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // @desc Delete a product
// // @route DELETE /products/:id
// // @access Private (Admin or Manager)
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     const deletedProduct = await Product.findByIdAndDelete(id);

//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };

const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc Get all products
// @route GET /products
// @access Private
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

// @desc Get a single product by ID
// @route GET /products/:id
// @access Private
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

// Utility function to determine product status based on stock
const getProductStatus = (stock, minStock) => {
  if (stock <= 0) return "critical";
  if (stock <= minStock) return "low stock";
  return "instock";
};

// @desc Create a new product
// @route POST /products
// @access Private (Admin or Manager)
const createProduct = async (req, res) => {
  try {
    const {
      product,
      stock,
      minStock = 5,
      category,
      price,
      description,
      image,
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

    const status = getProductStatus(stock, minStock);

    const newProduct = await Product.create({
      product,
      stock,
      minStock,
      category,
      price,
      description,
      image,
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
// @route PATCH /products/:id
// @access Private (Admin or Manager)
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

    const updatedData = {
      ...updates,
      status: getProductStatus(
        updates.stock !== undefined ? updates.stock : existingProduct.stock,
        updates.minStock !== undefined
          ? updates.minStock
          : existingProduct.minStock
      ),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

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
// @route DELETE /products/:id
// @access Private (Admin or Manager)
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
// @route GET /products/category/:category
// @access Private
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

// Example: GET /api/products/categories
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
