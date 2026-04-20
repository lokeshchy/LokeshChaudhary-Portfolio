import { PrismaClient } from '@prisma/client';
import { env } from '@/lib/env.server';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (!env.isProduction) globalForPrisma.prisma = prisma;
