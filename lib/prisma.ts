import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient({ log: ['error'] })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getOrCreateUser() {
  let user = await prisma.user.findUnique({ where: { email: 'demo@gateforge.com' } })
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'demo@gateforge.com', name: 'GATE Aspirant', targetExam: 'CSE', targetScore: 70, dailyHours: 6, targetDate: '2026-02-08' }
    })
    await prisma.analytics.create({ data: { userId: user.id } })
  }
  return user
}
