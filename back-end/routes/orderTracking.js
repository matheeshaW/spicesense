const express = require("express");
const router = express.Router();
const orderTrackingController = require("../controllers/orderTrackingController");

// Get current status of an order
router.get("/status/:orderId", orderTrackingController.getOrderStatus);

// Get status history of an order
router.get("/history/:orderId", orderTrackingController.getOrderStatusHistory);

// Update order status
router.post("/update/:orderId", orderTrackingController.updateOrderStatus);

// Get summary of orders by status (for admin dashboard)
router.get("/summary", orderTrackingController.getOrdersStatusSummary);

// Get all orders by status
router.get("/orders/:status", orderTrackingController.getOrdersByStatus);

module.exports = router;

