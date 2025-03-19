const express = require("express");
const router = express.Router();
const Batch = require("../models/Batch");
const Product = require("../models/Product");

// get all batches for a product
router.get("/:productId", async (req, res) => {
    try {
        const batches = await
    }
})