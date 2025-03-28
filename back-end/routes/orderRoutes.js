import express from 'express';
import { 
  createOrder, 
  getSupplierOrders, 
  getAdminOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';

const orderRouter = express.Router();

// Protect all routes with authentication
orderRouter.use(userAuth);

// Routes
orderRouter.post('/', createOrder); // Create an order from an approved message
orderRouter.get('/supplier', getSupplierOrders); // Get orders for the logged-in supplier
orderRouter.get('/admin', getAdminOrders); // Get orders for admin (with filters)
orderRouter.get('/:orderId', getOrderDetails); // Get details for a specific order
orderRouter.put('/status/:orderId', updateOrderStatus); // Update order status

export default orderRouter;
