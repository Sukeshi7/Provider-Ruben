const nodeCrypto = require("crypto");

// Clé partagée entre l'API et l'ESP32 — 32 bytes pour AES-256
const SHARED_KEY = Buffer.from(
  process.env.AES_KEY || "ProjetRuben2025!!ProjetRuben2025",
  "utf8"
);

function generatePassword(length = 16) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
  const bytes = nodeCrypto.randomBytes(length);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

function encrypt(plaintext) {
  const iv = nodeCrypto.randomBytes(12);
  const cipher = nodeCrypto.createCipheriv("aes-256-gcm", SHARED_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
}

function decrypt(token) {
  const [ivHex, authTagHex, encryptedHex] = token.split(":");
  const iv        = Buffer.from(ivHex,        "hex");
  const authTag   = Buffer.from(authTagHex,   "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher  = nodeCrypto.createDecipheriv("aes-256-gcm", SHARED_KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

module.exports = { generatePassword, encrypt, decrypt, SHARED_KEY };