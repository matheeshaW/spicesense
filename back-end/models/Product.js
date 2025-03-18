const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, enum: ["Raw Material", "Finished Product"], required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    addedDate: { type: Date, default: Date.now },
    image: { type: String },
    batchNo: { type: String, unique: true }
    
});

// auto generated batch no
productSchema.pre("save", async function (next) {
    if (!this.batchNo) {
        const lastProduct = await mongoose.model("Product").findOne()
            .sort({ _id: -1 })
            .select("batchNo");
        if (lastProduct && lastProduct.batchNo) {
            let lastBatchNo = parseInt(lastProduct.batchNo.replace("B", ""), 10);
            this.batchNo = `B${lastBatchNo + 1}`;
        } else {
            this.batchNo = "B100";
        }
    }
    next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;