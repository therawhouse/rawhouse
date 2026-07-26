import { PrismaClient } from "@prisma/client";

/**
 * ============================================================================
 * THE RAW HOUSE - Prisma Database Singleton Client
 * ============================================================================
 * Architecture Note:
 * In Next.js development mode, hot-module replacement (HMR) re-executes modules.
 * This global singleton prevents instantiating duplicate PrismaClient instances
 * which could exhaust database connection pools in Supabase PostgreSQL.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
