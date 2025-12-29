import { PrismaClient } from '@/generated/prisma'; // Ensure this matches your actual folder
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // log: ['query', 'error', 'warn'],
    log: ['error'], // log if something goes wrong
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
