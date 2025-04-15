import express from 'express';
import { 
  createOrderDelivery, 
  getSupplierOrderDeliveries, 
  getAdminOrderDeliveries,
  getOrderDeliveryDetails,
  updateOrderDeliveryStatus
} from '../controllers/orderDeliveryController.js';
import userAuth from '../middleware/userAuth.js';

const orderDeliveryRouter = express.Router();

// Protect all routes with authentication
orderDeliveryRouter.use(userAuth);

// Routes
orderDeliveryRouter.post('/', createOrderDelivery); // Create an orderDelivery from an approved message
orderDeliveryRouter.get('/supplier', getSupplierOrderDeliveries); // Get orderDeliveries for the logged-in supplier
orderDeliveryRouter.get('/admin', getAdminOrderDeliveries); // Get orderDeliveries for admin (with filters)
orderDeliveryRouter.get('/:orderDeliveryId', getOrderDeliveryDetails); // Get details for a specific orderDelivery
orderDeliveryRouter.put('/status/:orderDeliveryId', updateOrderDeliveryStatus); // Update orderDelivery status

export default orderDeliveryRouter;