import mongoose from "mongoose";

const orderDeliverySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSupplier",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "approved",                // Initial state after supplier approves the request
        "ready_for_shipment",      // Marked by supplier as ready to ship
        "shipped",                 // Delivery has been created and shipped
        "in_transit",              // Delivery is on the way
        "delivered",               // Delivery completed
        "completed",               // Order fully completed
        "cancelled"                // Order cancelled
      ],
      default: "approved",
    },
    notes: {
      type: String,
      default: "",
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
orderDeliverySchema.index({ supplierId: 1, status: 1 });
orderDeliverySchema.index({ adminId: 1, status: 1 });
orderDeliverySchema.index({ productId: 1 });

const OrderDelivery = mongoose.model("OrderDelivery", orderDeliverySchema);

export default OrderDelivery;