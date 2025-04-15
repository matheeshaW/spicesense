import mongoose from "mongoose";

const shipmentDeliverySchema = new mongoose.Schema(
  {
    orderDeliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderDelivery",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    carrier: {
      type: String,
      trim: true,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "delivered"],
      default: "pending",
    },
    deliveryNotes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
shipmentDeliverySchema.index({ orderDeliveryId: 1 });
shipmentDeliverySchema.index({ supplierId: 1, status: 1 });
shipmentDeliverySchema.index({ status: 1, expectedDeliveryDate: 1 });

const ShipmentDelivery = mongoose.model("ShipmentDelivery", shipmentDeliverySchema);

export default ShipmentDelivery;