import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

// Define your secret key and token expiration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret'; // Use an environment variable in production
const TOKEN_EXPIRATION = '4h'; // Adjust as needed (e.g., '1h', '7d', etc.)

/**
 * Generates a JWT token for a given payload.
 * @param payload - The payload to encode in the JWT.
 * @returns A signed JWT token.
 */
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT token to verify.
 * @returns The decoded payload.
 * @throws An error if the token is invalid or expired.
 */
export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch (err) {
    console.log(err)
    return null
  }
}

// Example usage

