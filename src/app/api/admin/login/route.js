import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

// Simple in-memory limit: 5 failed attempts per IP per 15 minutes.
const attempts = globalThis._loginAttempts || (globalThis._loginAttempts = new Map());
const WINDOW = 15 * 60 * 1000;

export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.first < WINDOW && rec.count >= 5)
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  let email = "", password = "";
  try {
    ({ email = "", password = "" } = await req.json());
  } catch {}

  const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const ok =
    expectedEmail && hash && String(email).trim().toLowerCase() === expectedEmail && (await bcrypt.compare(String(password), hash));

  if (!ok) {
    const r = rec && now - rec.first < WINDOW ? rec : { first: now, count: 0 };
    r.count += 1;
    attempts.set(ip, r);
    await new Promise((res) => setTimeout(res, 600));
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  await createSession(expectedEmail);
  return NextResponse.json({ ok: true });
}
