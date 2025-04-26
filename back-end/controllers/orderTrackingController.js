const Order = require("../models/Order");
const OrderStatusHistory = require("../models/OrderStatusHistory");

// Get order current status
exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    res.status(200).json({
      success: true,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDeliveryDate: order.estimatedDeliveryDate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving order status",
      error: error.message
    });
  }
};

// Get order status history
exports.getOrderStatusHistory = async (req, res) => {
  try {
    const statusHistory = await OrderStatusHistory.find({ 
      orderId: req.params.orderId 
    }).sort({ timestamp: 1 }).populate("updatedBy", "name");
    
    if (!statusHistory || statusHistory.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No status history found for this order" 
      });
    }
    
    res.status(200).json({
      success: true,
      statusHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving order status history",
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, notes, trackingNumber, estimatedDeliveryDate } = req.body;
    const { orderId } = req.params;
    const userId = req.body.userId; // The user who is updating the status
    
    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }
    
    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // Update the order status
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDeliveryDate) order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
    
    await order.save();
    
    // Create a status history entry
    const statusHistory = new OrderStatusHistory({
      orderId,
      status,
      notes,
      updatedBy: userId
    });
    
    await statusHistory.save();
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
      statusHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

// Get status summary for all orders
exports.getOrdersStatusSummary = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Format the response
    const summary = {};
    statusCounts.forEach(item => {
      summary[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders status summary",
      error: error.message
    });
  }
};

// Get all orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }
    
    const orders = await Order.find({ status }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders by status",
      error: error.message
    });
  }
};

