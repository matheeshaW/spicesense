import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderDeliver",
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
deliverySchema.index({ orderId: 1 });
deliverySchema.index({ supplierId: 1, status: 1 });
deliverySchema.index({ status: 1, expectedDeliveryDate: 1 });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
