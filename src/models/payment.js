const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stripePaymentId: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "succeeded", "failed", "refunded"],
    default: "pending", 
  },
  membershipType: {
    type: String, 
    required: true,
  },
  receiptUrl: {
    type: String, 
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);