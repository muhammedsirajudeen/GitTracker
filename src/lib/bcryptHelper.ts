import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt.
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds (default: 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a password against a hashed password.
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating if the password matches.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
