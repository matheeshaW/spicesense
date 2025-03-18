const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require("multer");
const path = require("path");
const { error } = require('console');

// image storage configuration
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });



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
        const { productName, category, quantity, expiryDate } = req.body;
        const image = req.file ? `/uploads/${req.file.fieldname}` : req.body.imageUrl;

        const lastProduct = await Product.findOne().sort({ batchNo: -1 });

        let newBatchNo = "B100";
        if (lastProduct && lastProduct.batchNo) {
            const lastBatchNumber = parseInt(lastProduct.batchNo.substring(1));
            newBatchNo = `B${lastBatchNumber + 1}`;
        }

        const newProduct = new Product({
            productName,
            category,
            quantity,
            expiryDate,
            image,
            batchNo: newBatchNo
        });

        await newProduct.save();
        res.json({ message: "Product added successfully!", product: newProduct });
    
    } catch (error) {
        res.status(400).json({ message: "Error adding product", error });
    }
});



router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { productName, category, quantity, expiryDate} = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        existingProduct.productName = productName;
        existingProduct.category = category;
        existingProduct.quantity = quantity;
        existingProduct.expiryDate = expiryDate;
        existingProduct.image = image;

        const updatedProduct = await existingProduct.save();

        res.json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ error: "Error updating product" });
    }
});

router.get("/latest-batch", async (req, res) => {
    try {
        const lastProduct = await Product.findOne({}, {}, { sort: { batchNo: -1 } });
        if (lastProduct && lastProduct.batchNo) {
            let lastBatchNo = parseInt(lastProduct.batchNo.replace("B", ""), 10);
            return res.json({ batchNo: `B${lastBatchNo + 1}` });
        } else {
            return res.json({ batchNo: "B100" });  // Start from B100
        }
    } catch (error) {
        console.error("Error fetching latest batch number:", error);
        res.status(500).json({ error: "Error fetching batch number" });
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