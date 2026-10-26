import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/lib/models/Customer";
import { verifyFirebaseIdToken } from "@/lib/firebase-verify";
import { createCustomerSession } from "@/lib/customer-session";

export const runtime = "nodejs";

/*
 * Called right after "Continue with Google" succeeds in the browser.
 * Firebase has already created (or found) the user on its side; here we verify their ID token,
 * create or update the matching customer in MongoDB, and start our own session cookie.
 */
export async function POST(req) {
  let idToken;
  try {
    ({ idToken } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let user;
  try {
    user = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    console.warn("[auth] token rejected:", err.message);
    return NextResponse.json({ error: "Sign-in could not be verified. Please try again." }, { status: 401 });
  }
  if (user.provider !== "google.com" || !user.email || !user.emailVerified)
    return NextResponse.json({ error: "Please sign in with a verified Google account." }, { status: 401 });

  try {
    await connectDB();
    const customer = await Customer.findOneAndUpdate(
      { firebaseUid: user.uid },
      {
        $set: { email: user.email.toLowerCase(), name: user.name, photoUrl: user.picture, provider: user.provider, lastLoginAt: new Date() },
        $inc: { loginCount: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await createCustomerSession(customer._id);
    return NextResponse.json({ ok: true, customer: { name: customer.name, email: customer.email, photoUrl: customer.photoUrl } });
  } catch (err) {
    console.error("[auth]", err);
    return NextResponse.json({ error: "Couldn’t sign you in right now. Please try again." }, { status: 500 });
  }
}
