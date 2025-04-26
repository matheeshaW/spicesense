const express = require('express');
const Order = require('../models/Order');
const Item = require('../models/Item');
const router = express.Router();

// Get All Orders (new endpoint for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: 'Error fetching all orders', error: err.message });
  }
});

// Get Order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.itemId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(' Error fetching order:', err);
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

// Create Order
router.post('/create', async (req, res) => {
  const { userId, items, shippingAddress, billingAddress } = req.body;
  try {
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid request. User ID and items are required.' });
    }

    let total = 0;
    let validatedItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = await Item.findById(items[i].itemId);
      if (!item) {
        return res.status(404).json({ message: `Item with ID ${items[i].itemId} not found` });
      }
      validatedItems.push({
        itemId: item._id,
        quantity: items[i].quantity,
        price: item.price
      });
      total += item.price * items[i].quantity;
    }

    const newOrder = new Order({
      userId,
      items: validatedItems,
      total,
      status: 'pending',
      shippingAddress,
      billingAddress
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error(' Error creating order:', err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// Update Order
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT request for order ID:', req.params.id); // Log the ID
    console.log('Request body:', req.body); // Log the request body
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log('Order not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status if provided
    if (req.body.status) {
      order.status = req.body.status;
    }

    // Update items if provided
    if (req.body.items && req.body.items.length > 0) {
      let total = 0;
      const validatedItems = [];
      for (let i = 0; i < req.body.items.length; i++) {
        console.log('Validating item ID:', req.body.items[i].itemId); // Log each itemId
        const item = await Item.findById(req.body.items[i].itemId);
        if (!item) {
          return res.status(404).json({ message: `Item with ID ${req.body.items[i].itemId} not found` });
        }
        validatedItems.push({
          itemId: item._id,
          quantity: req.body.items[i].quantity,
          price: item.price
        });
        total += item.price * req.body.items[i].quantity;
      }
      order.items = validatedItems;
      order.total = total;
    }

    // Update addresses if provided
    if (req.body.shippingAddress) order.shippingAddress = req.body.shippingAddress;
    if (req.body.billingAddress) order.billingAddress = req.body.billingAddress;

    await order.save();
    res.json({ message: 'Order updated successfully', order });
  } catch (err) {
    console.error(' Error updating order:', err);
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});

// Delete Order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(' Error deleting order:', err);
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});

module.exports = router;
