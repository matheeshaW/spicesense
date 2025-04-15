import ShipmentDelivery from "../models/ShipmentDelivery.js";
import OrderDelivery from "../models/OrderDelivery.js";

// Get all shipmentDeliveries for a supplier
export const getSupplierShipmentDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter
    const filter = { supplierId: req.user.id, isActive: true };
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get shipmentDeliveries for this supplier
    const shipmentDeliveries = await ShipmentDelivery.find(filter)
      .populate({
        path: "orderDeliveryId",
        select: "productId quantity status",
        populate: {
          path: "productId",
          select: "productName productCategory"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      shipmentDeliveries
    });
  } catch (error) {
    console.error("Error fetching supplier shipmentDeliveries:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Create or update shipmentDelivery
export const updateShipmentDelivery = async (req, res) => {
  try {
    const { shipmentDeliveryId } = req.params;
    const {
      orderDeliveryId,
      trackingNumber,
      carrier,
      expectedDeliveryDate,
      actualDeliveryDate,
      status,
      deliveryNotes
    } = req.body;
    
    let shipmentDelivery;
    
    // Check if we're updating an existing shipmentDelivery or creating a new one
    if (shipmentDeliveryId) {
      // Updating existing shipmentDelivery
      shipmentDelivery = await ShipmentDelivery.findById(shipmentDeliveryId);
      
      if (!shipmentDelivery || !shipmentDelivery.isActive) {
        return res.status(404).json({
          success: false,
          message: "ShipmentDelivery not found"
        });
      }
      
      // Verify that the shipmentDelivery belongs to the authenticated supplier
      if (shipmentDelivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }
    } else if (orderDeliveryId) {
      // Creating a new shipmentDelivery based on an orderDelivery
      // Get the orderDelivery
      const orderDelivery = await OrderDelivery.findById(orderDeliveryId);
      
      if (!orderDelivery || !orderDelivery.isActive) {
        return res.status(404).json({
          success: false,
          message: "OrderDelivery not found"
        });
      }
      
      // Verify that the orderDelivery belongs to the authenticated supplier
      if (orderDelivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }
      
      // Check if the orderDelivery is in a valid state for shipmentDelivery
      if (orderDelivery.status !== "ready_for_shipment" && orderDelivery.status !== "shipped" && orderDelivery.status !== "in_transit") {
        return res.status(400).json({
          success: false,
          message: "OrderDelivery must be ready for shipment, shipped, or in transit to update shipmentDelivery"
        });
      }
      
      // Check if a shipmentDelivery already exists for this orderDelivery
      shipmentDelivery = await ShipmentDelivery.findOne({ orderDeliveryId, isActive: true });
      
      if (!shipmentDelivery) {
        // Create a new shipmentDelivery
        shipmentDelivery = new ShipmentDelivery({
          orderDeliveryId,
          supplierId: req.user.id,
          status: "pending"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either shipmentDeliveryId or orderDeliveryId is required"
      });
    }
    
    // Update the shipmentDelivery
    if (trackingNumber) shipmentDelivery.trackingNumber = trackingNumber;
    if (carrier) shipmentDelivery.carrier = carrier;
    if (expectedDeliveryDate) shipmentDelivery.expectedDeliveryDate = new Date(expectedDeliveryDate);
    if (status) shipmentDelivery.status = status;
    if (deliveryNotes) shipmentDelivery.deliveryNotes = deliveryNotes;
    
    // Only set actualDeliveryDate if status is delivered
    if (status === "delivered") {
      shipmentDelivery.actualDeliveryDate = actualDeliveryDate ? new Date(actualDeliveryDate) : new Date();
    }
    
    await shipmentDelivery.save();
    
    // Update the associated orderDelivery status based on shipmentDelivery status
    if (status) {
      const orderDelivery = await OrderDelivery.findById(shipmentDelivery.orderDeliveryId);
      if (orderDelivery) {
        let orderDeliveryStatus;
        
        switch (status) {
          case "shipped":
            orderDeliveryStatus = "shipped";
            break;
          case "in_transit":
            orderDeliveryStatus = "in_transit";
            break;
          case "delivered":
            orderDeliveryStatus = "delivered";
            break;
          default:
            orderDeliveryStatus = orderDelivery.status;
        }
        
        if (orderDeliveryStatus !== orderDelivery.status) {
          orderDelivery.status = orderDeliveryStatus;
          await orderDelivery.save();
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "ShipmentDelivery updated successfully",
      shipmentDelivery
    });
  } catch (error) {
    console.error("Error updating shipmentDelivery:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get shipmentDelivery details
export const getShipmentDeliveryDetails = async (req, res) => {
  try {
    const { shipmentDeliveryId } = req.params;
    
    const shipmentDelivery = await ShipmentDelivery.findById(shipmentDeliveryId)
      .populate({
        path: "orderDeliveryId",
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
    
    if (!shipmentDelivery || !shipmentDelivery.isActive) {
      return res.status(404).json({
        success: false,
        message: "ShipmentDelivery not found"
      });
    }
    
    // Verify that the shipmentDelivery belongs to the authenticated supplier or admin
    if (shipmentDelivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    
    return res.status(200).json({
      success: true,
      shipmentDelivery
    });
  } catch (error) {
    console.error("Error fetching shipmentDelivery details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Mark shipmentDelivery as completed
export const completeShipmentDelivery = async (req, res) => {
  try {
    const { shipmentDeliveryId } = req.params;
    const { actualDeliveryDate, deliveryNotes } = req.body;
    
    const shipmentDelivery = await ShipmentDelivery.findById(shipmentDeliveryId);
    
    if (!shipmentDelivery || !shipmentDelivery.isActive) {
      return res.status(404).json({
        success: false,
        message: "ShipmentDelivery not found"
      });
    }
    
    // Verify that the shipmentDelivery belongs to the authenticated supplier
    if (shipmentDelivery.supplierId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    
    // Update shipmentDelivery status
    shipmentDelivery.status = "delivered";
    shipmentDelivery.actualDeliveryDate = actualDeliveryDate ? new Date(actualDeliveryDate) : new Date();
    if (deliveryNotes) shipmentDelivery.deliveryNotes = deliveryNotes;
    
    await shipmentDelivery.save();
    
    // Update the associated orderDelivery status
    const orderDelivery = await OrderDelivery.findById(shipmentDelivery.orderDeliveryId);
    if (orderDelivery) {
      orderDelivery.status = "delivered";
      await orderDelivery.save();
    }
    
    return res.status(200).json({
      success: true,
      message: "ShipmentDelivery marked as completed",
      shipmentDelivery
    });
  } catch (error) {
    console.error("Error completing shipmentDelivery:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};