import express from 'express';
import { 
  getSupplierDeliveries, 
  updateDelivery,
  getDeliveryDetails,
  completeDelivery
} from '../controllers/deliveryController.js';
import userAuth from '../middleware/userAuth.js';

const deliveryRouter = express.Router();

// Protect all routes with authentication
deliveryRouter.use(userAuth);

// Routes
deliveryRouter.get('/supplier', getSupplierDeliveries); // Get deliveries for the logged-in supplier
deliveryRouter.post('/', updateDelivery); // Create a new delivery
deliveryRouter.put('/:deliveryId', updateDelivery); // Update an existing delivery
deliveryRouter.get('/:deliveryId', getDeliveryDetails); // Get delivery details
deliveryRouter.put('/complete/:deliveryId', completeDelivery); // Mark delivery as completed

export default deliveryRouter;