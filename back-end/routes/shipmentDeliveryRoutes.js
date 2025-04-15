import express from 'express';
import { 
  getSupplierShipmentDeliveries, 
  updateShipmentDelivery,
  getShipmentDeliveryDetails,
  completeShipmentDelivery
} from '../controllers/shipmentDeliveryController.js';
import userAuth from '../middleware/userAuth.js';

const shipmentDeliveryRouter = express.Router();

// Protect all routes with authentication
shipmentDeliveryRouter.use(userAuth);

// Routes
shipmentDeliveryRouter.get('/supplier', getSupplierShipmentDeliveries); // Get shipmentDeliveries for the logged-in supplier
shipmentDeliveryRouter.post('/', updateShipmentDelivery); // Create a new shipmentDelivery
shipmentDeliveryRouter.put('/:shipmentDeliveryId', updateShipmentDelivery); // Update an existing shipmentDelivery
shipmentDeliveryRouter.get('/:shipmentDeliveryId', getShipmentDeliveryDetails); // Get shipmentDelivery details
shipmentDeliveryRouter.put('/complete/:shipmentDeliveryId', completeShipmentDelivery); // Mark shipmentDelivery as completed

export default shipmentDeliveryRouter;