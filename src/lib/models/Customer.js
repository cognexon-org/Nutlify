import mongoose from "mongoose";

/*
 * A customer who signed in with Google (through Firebase Authentication).
 * Firebase keeps the login itself; everything else about the customer lives here.
 */
const CustomerSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    name: { type: String, trim: true },
    photoUrl: String,
    provider: { type: String, default: "google.com" },
    // Filled in from their latest checkout, so the next one is quicker.
    phone: String,
    savedAddress: {
      address1: String,
      address2: String,
      city: String,
      state: String,
      pincode: String,
    },
    lastLoginAt: Date,
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
