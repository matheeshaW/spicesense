<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
<<<<<<< Updated upstream
  items: [{ 
    itemId: mongoose.Schema.Types.ObjectId, 
    price: Number, 
    quantity: Number 
  }],
  total: Number,
  status: { 
    type: String, 
    enum: [
      "pending", 
      "paid", 
      "ready for shipment", 
      "shipped", 
      "in transit", 
      "delivered"
    ], 
    default: "pending" 
  },
  invoiceId: String,
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Order", OrderSchema);




=======
  items: [
    { itemId: mongoose.Schema.Types.ObjectId, price: Number, quantity: Number },
  ], // Updated to itemId, removed name
  total: Number,
  status: {
    type: String,
    enum: [
      "pending",
      "paid",
      "ready for shipment",
      "shipped",
      "in transit",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  invoiceId: String,
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
>>>>>>> Stashed changes
