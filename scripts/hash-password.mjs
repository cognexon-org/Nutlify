// Usage: npm run hash-password -- "your-strong-password"
import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw || pw.length < 6) {
  console.error('Please give a password of at least 6 characters:  npm run hash-password -- "your-password"');
  process.exit(1);
}
if (pw.length < 12) console.warn("\nNote: passwords under 12 characters are easy to guess. Use a longer one for the live site.");
const hash = await bcrypt.hash(pw, 12);
console.log("\nFor .env.local (the backslashes stop Next.js treating $ as a variable):\n");
console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}\n`);
console.log("For Vercel or another host's environment settings (paste the value exactly, no backslashes):\n");
console.log(`${hash}\n`);
