const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing","confirmed", "shipped", "delivered"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    shippingMethod: {
      type: String,
      required: false,
    },
    subtotal: {
      type: Number,
      required: false,
      default: 0,
    },
    tax: {
      type: Number,
      required: false,
      default: 0,
    },
    shippingCost: {
      type: Number,
      required: false,
      default: 0,
    },
    totalCost: {
      type: Number,
      required: false,
      default: 0,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    discountCode: String,
    orderNotes: String,
    trackingNumber: String,
    returnRefundStatus: String,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
