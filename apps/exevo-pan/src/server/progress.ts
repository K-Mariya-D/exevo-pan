import { TRPCError } from '@trpc/server'
import { authedProcedure } from 'server/trpc'
import { z } from 'zod'
import { prisma } from 'lib/prisma'
import { CharBazaarClient } from 'services/server'
import { apiSuccess, toTRPCError } from './api'
import { assertGuildAccess } from './guild/access'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

const windowStart = (): Date => new Date(Date.now() - THIRTY_DAYS_MS)

// Импорт персонажа из внешнего сервиса в БД
export const importCharacter = authedProcedure
  .input(
    z.object({
      name: z.string().min(1),
      externalId: z.string().min(1).optional(),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { name, externalId } }) => {
    try {
      const imported = await CharBazaarClient.fetchCharacter(name.trim())
      const importedExternalId =
        externalId?.trim() || imported.name.toLowerCase()
      // Если персонажа нет - create, если есть - update
      const character = await prisma.character.upsert({
        where: { externalId: importedExternalId },
        update: {
          name: imported.name,
          vocation: imported.vocation,
          userId: token.id,
        },
        create: {
          userId: token.id,
          externalId: importedExternalId,
          name: imported.name,
          vocation: imported.vocation,
        },
      })

      const snapshot = await prisma.characterSnapshot.create({
        data: {
          characterId: character.id,
          level: imported.level,
          skills: imported.skills ?? {},
          achievementsCount: imported.achievementsCount ?? 0,
        },
      })

      return apiSuccess({ character, snapshot })
    } catch (error) {
      throw toTRPCError(error, 'Failed to import character')
    }
  })
// Обновляет существующего персонажа (создаёт новый snapshot)
export const syncCharacter = authedProcedure
  .input(z.object({ characterId: z.string() }))
  .mutation(async ({ ctx: { token }, input: { characterId } }) => {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    })

    if (!character) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Character not found' })
    }

    if (character.userId !== token.id && token.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Character does not belong to current user',
      })
    }

    try {
      const imported = await CharBazaarClient.fetchCharacter(character.name)
      const snapshot = await prisma.characterSnapshot.create({
        data: {
          characterId: character.id,
          level: imported.level,
          skills: imported.skills ?? {},
          achievementsCount: imported.achievementsCount ?? 0,
        },
      })
      // Удаляются снимки старше 30 дней - оптимизация
      await prisma.characterSnapshot.deleteMany({
        where: {
          characterId: character.id,
          createdAt: { lt: windowStart() },
        },
      })

      return apiSuccess(snapshot)
    } catch (error) {
      throw toTRPCError(error, 'Failed to sync character')
    }
  })
// Возвращает персонажа и последний снимок
export const getCharacter = authedProcedure
  .input(z.object({ characterId: z.string() }))
  .query(async ({ ctx: { token }, input: { characterId } }) => {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        snapshots: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!character) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Character not found' })
    }

    if (character.userId !== token.id && token.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Character does not belong to current user',
      })
    }

    return apiSuccess({
      ...character,
      latestSnapshot: character.snapshots[0] ?? null,
    })
  })
// Возвращает историю прогресса за 30 дней
export const getCharacterHistory = authedProcedure
  .input(z.object({ characterId: z.string() }))
  .query(async ({ ctx: { token }, input: { characterId } }) => {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { id: true, userId: true },
    })

    if (!character) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Character not found' })
    }

    if (character.userId !== token.id && token.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Character does not belong to current user',
      })
    }

    const history = await prisma.characterSnapshot.findMany({
      where: {
        characterId,
        createdAt: { gte: windowStart() },
      },
      orderBy: { createdAt: 'asc' },
    })
    return apiSuccess(history)
  })
// Собирает прогресс всей гильдии
export const getGuildProgress = authedProcedure
  .input(z.object({ guildId: z.string() }))
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    const isAdmin = token.role === 'ADMIN'
    await assertGuildAccess(guildId, token.id, isAdmin)

    const members = await prisma.guildMember.findMany({
      where: { guildId },
      select: { userId: true, name: true, role: true },
    })
    const memberUserIds = members.map((member) => member.userId)

    const characters = await prisma.character.findMany({
      where: { userId: { in: memberUserIds } },
      select: {
        id: true,
        name: true,
        vocation: true,
        userId: true,
        snapshots: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            level: true,
            achievementsCount: true,
            skills: true,
            createdAt: true,
          },
        },
      },
    })

    const byUser = new Map<string, typeof characters>()
    characters.forEach((character) => {
      const arr = byUser.get(character.userId) ?? []
      arr.push(character)
      byUser.set(character.userId, arr)
    })

    const membersProgress = members.map((member) => {
      const memberCharacters = byUser.get(member.userId) ?? []
      return {
        userId: member.userId,
        memberName: member.name,
        role: member.role,
        characters: memberCharacters.map((character) => ({
          id: character.id,
          name: character.name,
          vocation: character.vocation,
          latestSnapshot: character.snapshots[0] ?? null,
        })),
      }
    })

    const latestSnapshots = characters
      .map((character) => character.snapshots[0])
      .filter(Boolean)

    const totalLevel = latestSnapshots.reduce(
      (acc, snapshot) => acc + (snapshot?.level ?? 0),
      0,
    )
    const totalAchievements = latestSnapshots.reduce(
      (acc, snapshot) => acc + (snapshot?.achievementsCount ?? 0),
      0,
    )

    return apiSuccess({
      members: membersProgress,
      summary: {
        trackedCharacters: latestSnapshots.length,
        averageLevel:
          latestSnapshots.length > 0 ? totalLevel / latestSnapshots.length : 0,
        averageAchievements:
          latestSnapshots.length > 0
            ? totalAchievements / latestSnapshots.length
            : 0,
      },
    })
  })
// ranking system. Для каждого user'a: highest level, growth за 30 дней, achievements
export const getGuildLeaderboard = authedProcedure
  .input(z.object({ guildId: z.string() }))
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    const isAdmin = token.role === 'ADMIN'
    await assertGuildAccess(guildId, token.id, isAdmin)

    const members = await prisma.guildMember.findMany({
      where: { guildId },
      select: { userId: true, name: true },
    })

    const memberIds = members.map((member) => member.userId)
    const characters = await prisma.character.findMany({
      where: { userId: { in: memberIds } },
      select: {
        userId: true,
        snapshots: {
          where: { createdAt: { gte: windowStart() } },
          orderBy: { createdAt: 'asc' },
          select: {
            level: true,
            achievementsCount: true,
            createdAt: true,
          },
        },
      },
    })

    const memberNameByUserId = new Map(
      members.map((member) => [member.userId, member.name]),
    )

    const scoreByUser = new Map<
      string,
      {
        memberName: string
        highestLevel: number
        growth30d: number
        achievements: number
      }
    >()

    characters.forEach((character) => {
      const latest = character.snapshots[character.snapshots.length - 1]
      const earliest = character.snapshots[0]
      if (!latest || !earliest) return

      const current = scoreByUser.get(character.userId) ?? {
        memberName:
          memberNameByUserId.get(character.userId) ?? character.userId,
        highestLevel: 0,
        growth30d: 0,
        achievements: 0,
      }

      current.highestLevel = Math.max(current.highestLevel, latest.level)
      current.growth30d += latest.level - earliest.level
      current.achievements += latest.achievementsCount

      scoreByUser.set(character.userId, current)
    })

    const leaderboard = Array.from(scoreByUser.entries()).map(
      ([userId, score]) => ({
        userId,
        ...score,
      }),
    )

    return apiSuccess({
      highestLevel: [...leaderboard].sort(
        (a, b) => b.highestLevel - a.highestLevel,
      ),
      fastestGrowth30d: [...leaderboard].sort(
        (a, b) => b.growth30d - a.growth30d,
      ),
      achievements: [...leaderboard].sort(
        (a, b) => b.achievements - a.achievements,
      ),
    })
  })
