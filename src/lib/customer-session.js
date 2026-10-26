import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const CUSTOMER_COOKIE = "nutlify_customer";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(s);
}

export async function createCustomerSession(customerId) {
  const token = await new SignJWT({ role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(customerId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyCustomerSession() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}

/** The signed-in customer's MongoDB id, or null. */
export async function getCustomerId() {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload.role === "customer" ? payload.sub : null;
  } catch {
    return null;
  }
}
