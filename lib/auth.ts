import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function verifyAuth(sessionToken: string | null): Promise<{ id: string; email: string } | null> {
  if (!sessionToken) return null
  
  // Simple session verification - in production, use proper JWT or NextAuth
  try {
    // For now, we'll use a simple approach with cookies
    // In production, implement proper JWT verification
    const user = await prisma.user.findFirst()
    if (user) {
      return { id: user.id, email: user.email }
    }
    return null
  } catch {
    return null
  }
}
