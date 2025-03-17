const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require("multer");
const path = require("path");

// image storage configuration
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/names', async (req, res) => {
    try {
        const products = await Product.find({}, "productName");
        res.json(products.map(product => product.productName));
    } catch (error) {
        res.status(500).json({ message: "Error fetching product names", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const newProduct = new Product({
            productName: req.body.productName,
            category: req.body.category,
            quantity: req.body.quantity,
            expiryDate: req.body.expiryDate,
            batchNo: req.body.batchNo,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error adding product", error });
    }
});

// router.post('/', async (req, res) => {
//     try {
//         const newProduct = new Product(req.body);
//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(400).json({ message: "Error adding product", error });
//     }
// });

router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });

    }
});

module.exports = router;