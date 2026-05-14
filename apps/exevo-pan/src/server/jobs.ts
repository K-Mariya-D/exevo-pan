import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure } from 'server/trpc'
import { prisma } from 'lib/prisma'
import {
  AnalyticsClient,
  CharBazaarClient,
  IntegrationsClient,
} from 'services/server'
import { apiSuccess, toTRPCError } from './api'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const windowStart = (): Date => new Date(Date.now() - THIRTY_DAYS_MS)
// Даёт доступ к персонажам
const getScopedCharacterIds = async (userId: string, isAdmin: boolean) => {
  const where = isAdmin ? {} : { userId }
  const characters = await prisma.character.findMany({
    where,
    select: { id: true },
  })
  return characters.map((character) => character.id)
}
// Синхронизирует персонажаей из внешнего источника
export const runCharacterSyncJob = authedProcedure
  .input(
    z.object({
      characterIds: z.array(z.string()).optional(),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { characterIds } }) => {
    const isAdmin = token.role === 'ADMIN'

    const allowedCharacterIds = new Set(
      await getScopedCharacterIds(token.id, isAdmin),
    )
    const targetIds =
      characterIds && characterIds.length > 0
        ? characterIds.filter((id) => allowedCharacterIds.has(id))
        : [...allowedCharacterIds]

    if (targetIds.length === 0) {
      return apiSuccess({ synced: 0, failed: 0, failures: [] as string[] })
    }

    const targetCharacters = await prisma.character.findMany({
      where: { id: { in: targetIds } },
      select: { id: true, name: true },
    })

    const syncResults = await Promise.all(
      targetCharacters.map(async (character) => {
        try {
          const imported = await CharBazaarClient.fetchCharacter(character.name)
          await prisma.characterSnapshot.create({
            data: {
              characterId: character.id,
              level: imported.level,
              skills: imported.skills ?? {},
              achievementsCount: imported.achievementsCount ?? 0,
            },
          })
          return { ok: true as const }
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : 'Unknown sync error'
          return { ok: false as const, failure: `${character.id}: ${reason}` }
        }
      }),
    )

    const failures = syncResults
      .filter((result): result is { ok: false; failure: string } => !result.ok)
      .map((result) => result.failure)
    const synced = syncResults.length - failures.length

    return apiSuccess({
      synced,
      failed: failures.length,
      failures,
    })
  })
// Генерирует недельный отчёт гильдии
export const runWeeklyReportJob = authedProcedure
  .input(
    z.object({
      guildId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { guildId } }) => {
    const isAdmin = token.role === 'ADMIN'
    if (!isAdmin) {
      const member = await prisma.guildMember.findFirst({
        where: { guildId, userId: token.id },
        select: { id: true },
      })
      if (!member) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient privileges in this guild',
        })
      }
    }

    try {
      const report = await AnalyticsClient.getWeeklyReport(guildId)
      await IntegrationsClient.notifyGuildMembers({
        guildId,
        title: 'Weekly report',
        body: `Tracked members: ${report.activityOverview.trackedMembers}`,
      }).catch(() => undefined)
      return apiSuccess({
        generatedAt: report.generatedAt,
        guildId,
        report,
      })
    } catch (error) {
      throw toTRPCError(error, 'Failed to generate weekly report')
    }
  })
// Удаляет старые снимки персонажей
export const runCleanupSnapshotsJob = authedProcedure
  .input(
    z.object({
      characterIds: z.array(z.string()).optional(),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { characterIds } }) => {
    const isAdmin = token.role === 'ADMIN'

    const allowedCharacterIds = new Set(
      await getScopedCharacterIds(token.id, isAdmin),
    )
    const targetIds =
      characterIds && characterIds.length > 0
        ? characterIds.filter((id) => allowedCharacterIds.has(id))
        : [...allowedCharacterIds]

    if (targetIds.length === 0) {
      return apiSuccess({ deleted: 0 })
    }

    const deleted = await prisma.characterSnapshot.deleteMany({
      where: {
        characterId: { in: targetIds },
        createdAt: { lt: windowStart() },
      },
    })

    return apiSuccess({ deleted: deleted.count })
  })
