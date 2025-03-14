const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
