import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ============================================================================
 * THE RAW HOUSE - JWT & Password Security Infrastructure
 * ============================================================================
 */

const JWT_SECRET = process.env.JWT_SECRET || "the_raw_house_fallback_jwt_secret_key_2026";
const TOKEN_EXPIRY = "7d"; // 7 Days session validity

export interface JWTPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

/**
 * Hashes raw text passwords using bcrypt with salt round of 10
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plain password with database hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generates a signed JWT session token for authenticated users
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verifies and decodes incoming Bearer JWT tokens from request headers
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}
