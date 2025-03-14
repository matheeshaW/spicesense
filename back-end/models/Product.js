const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, enum: ["Raw Material", "Finished Product"], required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    addedDate: { type: Date, default: Date.now },
    image: { type: String },
    batchNo: { type: String, required: true, unique: true }
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;