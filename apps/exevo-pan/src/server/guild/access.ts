import { TRPCError } from '@trpc/server'
import { prisma } from 'lib/prisma'

export const assertGuildAccess = async (
  guildId: string,
  userId: string,
  isAdmin: boolean,
): Promise<void> => {
  if (isAdmin) return

  const member = await prisma.guildMember.findFirst({
    where: { guildId, userId },
    select: { id: true },
  })

  if (!member) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Insufficient privileges in this guild',
    })
  }
}
