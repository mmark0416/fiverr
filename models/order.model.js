import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: String,
      default: false,
    },
    payment_intent: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
