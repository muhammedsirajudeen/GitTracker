import { User } from '@/models/User';
import { jwtVerify,SignJWT } from 'jose';
import { JwtPayload } from 'jsonwebtoken';


// Define your secret key and token expiration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret'; // Use an environment variable in production
const TOKEN_EXPIRATION = '1d'; // Adjust as needed (e.g., '1h', '7d', etc.)

/**
 * Generates a JWT token for a given payload.
 * @param payload - The payload to encode in the JWT.
 * @returns A signed JWT token.
 */

export async function generateToken(payload: object,expiry?:string): Promise<string> {
  const jwt = await new SignJWT(payload as JwtPayload)
  .setProtectedHeader({ alg: "HS256" }) // Set algorithm
  .setIssuedAt() // Set issued time
  .setExpirationTime(expiry??TOKEN_EXPIRATION) // Set expiration time
  .sign(new TextEncoder().encode(JWT_SECRET)); // Sign with secret
  return jwt

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
    const error=err as Error
    console.log(error.message)
    return null
  }
}


// Example usage

