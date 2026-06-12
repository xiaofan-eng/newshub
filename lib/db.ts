import { PrismaNeon } from '@prisma/adapter-neon'

// Prisma 7: import from generated client path
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

type PrismaClientType = InstanceType<typeof PrismaClient>

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined
}

function createPrismaClient(): PrismaClientType {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export function getDb(): PrismaClientType {
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  return global.prisma
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
