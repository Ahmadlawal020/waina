const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// CRUD Routes
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/categories", productController.getUniqueCategories);

module.exports = router;
