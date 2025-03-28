import Delivery from "../models/deliveryModel.js";
import OrderDeliver from "../models/orderModel.js"; // Updated import

// Get all deliveries for a supplier
export const getSupplierDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter
    const filter = { supplierId: req.user.id, isActive: true };
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get deliveries for this supplier
    const deliveries = await Delivery.find(filter)
      .populate({
        path: "orderId",
        select: "productId quantity status",
        populate: {
          path: "productId",
          select: "productName productCategory"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      deliveries
    });
  } catch (error) {
    console.error("Error fetching supplier deliveries:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Create or update delivery
export const updateDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const {
      orderId,
      trackingNumber,
      carrier,
      expectedDeliveryDate,
      actualDeliveryDate,
      status,
      deliveryNotes
    } = req.body;
    
    let delivery;
    
    // Check if we're updating an existing delivery or creating a new one
    if (deliveryId) {
      // Updating existing delivery
      delivery = await Delivery.findById(deliveryId);
      
      if (!delivery || !delivery.isActive) {
        return res.status(404).json({
          success: false,
          message: "Delivery not found"
        });
      }
      
      // Verify that the delivery belongs to the authenticated supplier
      if (delivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }
    } else if (orderId) {
      // Creating a new delivery based on an order
      // Get the order
      const order = await OrderDeliver.findById(orderId);
      
      if (!order || !order.isActive) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }
      
      // Verify that the order belongs to the authenticated supplier
      if (order.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }
      
      // Check if the order is in a valid state for delivery
      if (order.status !== "ready_for_shipment" && order.status !== "shipped" && order.status !== "in_transit") {
        return res.status(400).json({
          success: false,
          message: "Order must be ready for shipment, shipped, or in transit to update delivery"
        });
      }
      
      // Check if a delivery already exists for this order
      delivery = await Delivery.findOne({ orderId, isActive: true });
      
      if (!delivery) {
        // Create a new delivery
        delivery = new Delivery({
          orderId,
          supplierId: req.user.id,
          status: "pending"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either deliveryId or orderId is required"
      });
    }
    
    // Update the delivery
    if (trackingNumber) delivery.trackingNumber = trackingNumber;
    if (carrier) delivery.carrier = carrier;
    if (expectedDeliveryDate) delivery.expectedDeliveryDate = new Date(expectedDeliveryDate);
    if (status) delivery.status = status;
    if (deliveryNotes) delivery.deliveryNotes = deliveryNotes;
    
    // Only set actualDeliveryDate if status is delivered
    if (status === "delivered") {
      delivery.actualDeliveryDate = actualDeliveryDate ? new Date(actualDeliveryDate) : new Date();
    }
    
    await delivery.save();
    
    // Update the associated order status based on delivery status
    if (status) {
      const order = await OrderDeliver.findById(delivery.orderId);
      if (order) {
        let orderStatus;
        
        switch (status) {
          case "shipped":
            orderStatus = "shipped";
            break;
          case "in_transit":
            orderStatus = "in_transit";
            break;
          case "delivered":
            orderStatus = "delivered";
            break;
          default:
            orderStatus = order.status;
        }
        
        if (orderStatus !== order.status) {
          order.status = orderStatus;
          await order.save();
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Delivery updated successfully",
      delivery
    });
  } catch (error) {
    console.error("Error updating delivery:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get delivery details
export const getDeliveryDetails = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    
    const delivery = await Delivery.findById(deliveryId)
      .populate({
        path: "orderId",
        select: "productId quantity status adminId totalPrice pricePerUnit",
        populate: [
          {
            path: "productId",
            select: "productName productCategory"
          },
          {
            path: "adminId",
            select: "name email"
          }
        ]
      });
    
    if (!delivery || !delivery.isActive) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }
    
    // Verify that the delivery belongs to the authenticated supplier or admin
    if (delivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    
    return res.status(200).json({
      success: true,
      delivery
    });
  } catch (error) {
    console.error("Error fetching delivery details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Mark delivery as completed
export const completeDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { actualDeliveryDate, deliveryNotes } = req.body;
    
    const delivery = await Delivery.findById(deliveryId);
    
    if (!delivery || !delivery.isActive) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }
    
    // Verify that the delivery belongs to the authenticated supplier
    if (delivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    
    // Update delivery status
    delivery.status = "delivered";
    delivery.actualDeliveryDate = actualDeliveryDate ? new Date(actualDeliveryDate) : new Date();
    if (deliveryNotes) delivery.deliveryNotes = deliveryNotes;
    
    await delivery.save();
    
    // Update the associated order status
    const order = await OrderDeliver.findById(delivery.orderId);
    if (order) {
      order.status = "delivered";
      await order.save();
    }
    
    return res.status(200).json({
      success: true,
      message: "Delivery marked as completed",
      delivery
    });
  } catch (error) {
    console.error("Error completing delivery:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};