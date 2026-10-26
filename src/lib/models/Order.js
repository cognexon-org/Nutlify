import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "paid", "packed", "shipped", "delivered", "cancelled", "failed", "refunded"];

const ItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    slug: String,
    name: String,
    variant: String,
    price: Number, // rupees for 1 at time of order
    mrp: Number, // MRP at time of order (if set)
    pairPrice: Number, // rupees for 2 at time of order (if any)
    qty: Number,
    lineTotal: Number,
    image: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    publicToken: { type: String, required: true }, // lets the customer view their order page
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", index: true }, // set when signed in with Google
    items: [ItemSchema],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    coupon: { code: String, description: String },
    shipping: Number,
    shippingZone: String, // local | state | rest
    shippingNote: String, // e.g. "Uttar Pradesh", "Free delivery code"
    total: Number,
    currency: { type: String, default: "INR" },
    customer: {
      name: String,
      phone: String,
      email: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      pincode: String,
    },
    notes: String,
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    payment: {
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: String,
      razorpaySignature: String,
      method: String,
      paidAt: Date,
    },
    stockApplied: { type: Boolean, default: false },
    tracking: { carrier: String, number: String, url: String },
    history: [{ status: String, note: String, at: { type: Date, default: Date.now }, _id: false }],
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customer.phone": 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
