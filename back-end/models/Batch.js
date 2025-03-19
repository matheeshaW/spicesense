const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    batchNo: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true }
});

module.exports = mongoose.model("Batch", BatchSchema);