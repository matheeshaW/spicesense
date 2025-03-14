const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  expiryDate: Date
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
