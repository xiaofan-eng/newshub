import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // PrismaNeon accepts PoolConfig directly
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export function getDb(): PrismaClient {
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  return global.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
