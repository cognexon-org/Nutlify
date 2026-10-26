import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" }, // shown to the customer when applied, e.g. "10% off for Diwali"
    type: { type: String, enum: ["percent", "flat", "freeship"], default: "percent" }, // freeship = free delivery
    value: { type: Number, default: 0, min: 0 }, // percent (e.g. 10) or rupees (e.g. 50); unused for freeship
    minSubtotal: { type: Number, default: 0 }, // cart must be at least this much (rupees)
    maxDiscount: { type: Number, default: null }, // cap for percent coupons (rupees), null = no cap
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    usageLimit: { type: Number, default: null }, // total paid orders allowed, null = unlimited
    usedCount: { type: Number, default: 0 }, // counted when an order is paid
    onePerCustomer: { type: Boolean, default: false }, // one paid order per phone number
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
