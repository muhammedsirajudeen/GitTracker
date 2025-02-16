import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';


// Define your secret key and token expiration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret'; // Use an environment variable in production
const TOKEN_EXPIRATION = '1d'; // Adjust as needed (e.g., '1h', '7d', etc.)

/**
 * Generates a JWT token for a given payload.
 * @param payload - The payload to encode in the JWT.
 * @returns A signed JWT token.
 */
export function generateToken(payload: object,expiry?:string): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry??TOKEN_EXPIRATION });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT token to verify.
 * @returns The decoded payload.
 * @throws An error if the token is invalid or expired.
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const {payload}=await  jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    // return payload as User
    return payload as unknown as User
  } catch (err) {
    console.log(err)
    return null
  }
}


// Example usage

