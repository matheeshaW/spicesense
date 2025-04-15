import OrderDelivery from "../models/OrderDelivery.js";
import Message from "../models/messageModel.js";
import ShipmentDelivery from "../models/ShipmentDelivery.js";

// Create order when supplier approves a message request
export const createOrderDelivery = async (req, res) => {
  try {
    const { messageId } = req.body;
    
    // Verify the user is a supplier
    if (req.user.role !== 'supplier') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Supplier only."
      });
    }

    // Check if the message exists and is approved
    const message = await Message.findById(messageId)
      .populate("productId")
      .populate("adminId");
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Verify the message belongs to the authenticated supplier
    if (message.supplierId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // Check if the message status is approved
    if (message.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot create order for non-approved requests"
      });
    }

    // Check if an order already exists for this message
    const existingOrder = await OrderDelivery.findOne({ messageId });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already exists for this request"
      });
    }

    // Calculate total price
    const totalPrice = message.approvedQuantity * message.approvedPrice;

    // Create the order
    const newOrder = new OrderDelivery({
      adminId: message.adminId._id,
      supplierId: req.user.id,
      productId: message.productId._id,
      quantity: message.approvedQuantity,
      pricePerUnit: message.approvedPrice,
      totalPrice,
      status: "approved",
      messageId: message._id
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get supplier's orders
export const getSupplierOrderDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter
    const filter = { supplierId: req.user.id, isActive: true };
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get orders for this supplier
    const orders = await OrderDelivery.find(filter)
      .populate({
        path: "productId",
        select: "productName productCategory"
      })
      .populate({
        path: "adminId",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get admin's orders
export const getAdminOrderDeliveries = async (req, res) => {
  try {
    // Verify the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const { status, supplierId } = req.query;
    
    // Build filter
    const filter = { isActive: true };
    if (status && status !== "all") {
      filter.status = status;
    }
    if (supplierId) {
      filter.supplierId = supplierId;
    }

    // Get orders
    const orders = await OrderDelivery.find(filter)
      .populate({
        path: "productId",
        select: "productName productCategory"
      })
      .populate({
        path: "supplierId",
        select: "name email companyName"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get order details
export const getOrderDeliveryDetails = async (req, res) => {
  try {
    const { orderDeliveryId } = req.params;
    
    const order = await OrderDelivery.findById(orderDeliveryId)
      .populate({
        path: "productId",
        select: "productName productCategory price"
      })
      .populate({
        path: "adminId",
        select: "name email"
      })
      .populate({
        path: "supplierId",
        select: "name email companyName contactPerson"
      })
      .populate({
        path: "messageId"
      });
    
    if (!order || !order.isActive) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isSupplier = order.supplierId._id.toString() === req.user.id;
    
    if (!isAdmin && !isSupplier) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    
    // Get associated delivery if exists
    const delivery = await ShipmentDelivery.findOne({ orderDeliveryId: order._id, isActive: true });
    
    return res.status(200).json({
      success: true,
      order,
      delivery
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update order status
export const updateOrderDeliveryStatus = async (req, res) => {
  try {
    const { orderDeliveryId } = req.params;
    const { status, notes } = req.body;
    
    // Validate status
    const validStatuses = ["approved", "ready_for_shipment", "shipped", "in_transit", "delivered", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }
    
    // Find the order
    const order = await OrderDelivery.findById(orderDeliveryId);
    
    if (!order || !order.isActive) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isSupplier = order.supplierId.toString() === req.user.id;
    
    if (!isAdmin && !isSupplier) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    
    // Update the order
    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    
    const updatedOrder = await OrderDelivery.findByIdAndUpdate(
      orderDeliveryId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: "productId",
      select: "productName productCategory"
    });
    
    // If status is changed to "ready_for_shipment", create a delivery placeholder
    if (status === "ready_for_shipment" && order.status !== "ready_for_shipment") {
      // Check if a delivery already exists
      const existingDelivery = await ShipmentDelivery.findOne({ orderDeliveryId: order._id, isActive: true });
      
      if (!existingDelivery) {
        // Create a new delivery
        const newDelivery = new ShipmentDelivery({
          orderDeliveryId: order._id,
          supplierId: order.supplierId,
          status: "pending"
        });
        
        await newDelivery.save();
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};