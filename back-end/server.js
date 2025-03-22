const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {

})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err));

// Import routes
const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

const itemRoutes = require('./routes/item');
app.use('/api/items', itemRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Spice Sense API is running...');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
