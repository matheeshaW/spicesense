const express = require("express");
const multer = require("multer");
const Product = require("../models/ProductModel");  // ✅ Ensure this matches your model filename

const router = express.Router();

// ✅ Image Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  // ✅ Ensure `uploads/` directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ✅ Get Product Names Only
router.get("/names", async (req, res) => {
    try {
        const products = await Product.find({}, "productName");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product names" });
    }
});

// ✅ Add Product (With Image Upload)
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { productName, category, quantity, expiryDate, batchNo } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newProduct = new Product({
            productName, category, quantity, expiryDate, batchNo, imageUrl
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Error adding product" });
    }
});

// ✅ Get All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
});

// ✅ Edit Product
router.put("/:id", async (req, res) => {
    try {
        const { productName } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { productName }, { new: true });

        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
});

// ✅ Delete Product
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
});

module.exports = router;
