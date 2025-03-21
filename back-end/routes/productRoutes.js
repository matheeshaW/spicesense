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


// get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});


// add a new product
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { productName, category} = req.body;
        const image = req.file ? `/uploads/${req.file.fieldname}` : "";

        

        const newProduct = new Product({
            productName,
            category,
            image,
        });

        await newProduct.save();
        res.json({ message: "Product added successfully!", product: newProduct });
    
    } catch (error) {
        res.status(400).json({ message: "Error adding product", error });
    }
});


// update a product
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { productName, category} = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { productName, category, image }, { new: true });
        

        

        res.json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ error: "Error updating product" });
    }
});




// delete a product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });

    }
});

module.exports = router;