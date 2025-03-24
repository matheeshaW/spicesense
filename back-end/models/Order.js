// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // Assuming you have an Item model
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  invoiceId: {
    type: String,
    default: null // Allows tracking invoices
  },
  shippingAddress: {
    type: String,
    required: true
  },
  billingAddress: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Automatically adds createdAt & updatedAt timestamps

module.exports = mongoose.model("Order", OrderSchema);
