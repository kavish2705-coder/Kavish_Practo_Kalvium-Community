import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing. Please configure a valid PostgreSQL DATABASE_URL in your environment."
    );
  }
  if (!prismaInstance) {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (prop === "then") return undefined;
    const client = globalForPrisma.prisma || getPrismaClient();
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
