import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";

/*
 * Verifies a Firebase ID token without a service account, using Google's public keys
 * (the method Firebase documents for third-party JWT libraries).
 */
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export async function verifyFirebaseIdToken(idToken) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set.");
  const { payload } = await jwtVerify(String(idToken || ""), JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ["RS256"],
  });
  const now = Math.floor(Date.now() / 1000);
  if (!payload.sub || typeof payload.sub !== "string") throw new Error("Token has no user.");
  if (typeof payload.auth_time !== "number" || payload.auth_time > now + 60) throw new Error("Bad auth_time.");
  return {
    uid: payload.sub,
    email: payload.email || "",
    emailVerified: payload.email_verified === true,
    name: payload.name || "",
    picture: payload.picture || "",
    provider: payload.firebase?.sign_in_provider || "",
  };
}
