import { prisma } from 'lib/prisma'

// Временные окна для расчёта статистики: 30 и 7 дней
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

const windowStart = (ms: number): Date => new Date(Date.now() - ms)
// Время хранения кэша
const CACHE_TTL_MS = 30 * 1000

// Средний уровень играков на сервере - для сравнения
const SERVER_BASELINES: Record<
  string,
  { averageLevel: number; averageSkill: number }
> = {
  Antica: { averageLevel: 320, averageSkill: 100 },
  Secura: { averageLevel: 280, averageSkill: 96 },
  Monza: { averageLevel: 260, averageSkill: 92 },
  default: { averageLevel: 250, averageSkill: 90 },
}

const parseSkills = (value: unknown): Record<string, number> => {
  if (!value || typeof value !== 'object') return {}
  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, number>
  >((acc, [key, current]) => {
    if (typeof current === 'number' && Number.isFinite(current)) {
      acc[key] = current
    }
    return acc
  }, {})
}

const analyticsCache = new Map<string, { expiresAt: number; value: unknown }>()

const getCached = <T>(key: string): T | null => {
  const hit = analyticsCache.get(key)
  if (!hit) return null
  if (hit.expiresAt < Date.now()) {
    analyticsCache.delete(key)
    return null
  }
  return hit.value as T
}

const setCached = <T>(key: string, value: T): T => {
  analyticsCache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value })
  return value
}
// Берет всех участников гильдии
const getGuildMemberUserIds = async (guildId: string): Promise<string[]> => {
  const members = await prisma.guildMember.findMany({
    where: { guildId },
    select: { userId: true },
  })

  return members.map((member) => member.userId)
}
// Логика аналитики
export default class AnalyticsClient {
  // Берёт последний снимок каждого персонажа
  static async getLatestCharacterSnapshots(guildId: string) {
    const cached = getCached<
      Array<{
        character: { userId: string; vocation: string | null }
        snapshot: {
          level: number
          skills: unknown
          achievementsCount: number
        } | null
      }>
    >(`latest:${guildId}`)
    if (cached) return cached

    const userIds = await getGuildMemberUserIds(guildId)
    const characters = await prisma.character.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        vocation: true,
        snapshots: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            level: true,
            skills: true,
            achievementsCount: true,
          },
        },
      },
    })

    return setCached(
      `latest:${guildId}`,
      characters
        .map((character) => ({
          character,
          snapshot: character.snapshots[0] ?? null,
        }))
        .filter((entry) => !!entry.snapshot),
    )
  }

  // Считает средний уровень, скиллы и сколько персонажей учтено в подсчёте
  static async getGuildStats(guildId: string) {
    const cached = getCached<{
      averageLevel: number
      averageSkills: Record<string, number>
      trackedCharacters: number
    }>(`stats:${guildId}`)
    if (cached) return cached

    const entries = await this.getLatestCharacterSnapshots(guildId)
    if (entries.length === 0) {
      return { averageLevel: 0, averageSkills: {}, trackedCharacters: 0 }
    }

    const totalLevel = entries.reduce(
      (acc, { snapshot }) => acc + (snapshot?.level ?? 0),
      0,
    )
    const skillBuckets = new Map<string, { total: number; count: number }>()
    entries.forEach(({ snapshot }) => {
      const skills = parseSkills(snapshot?.skills)
      Object.entries(skills).forEach(([name, value]) => {
        const current = skillBuckets.get(name) ?? { total: 0, count: 0 }
        current.total += value
        current.count += 1
        skillBuckets.set(name, current)
      })
    })

    const averageSkills = Array.from(skillBuckets.entries()).reduce<
      Record<string, number>
    >((acc, [name, value]) => {
      acc[name] = value.count > 0 ? value.total / value.count : 0
      return acc
    }, {})

    return setCached(`stats:${guildId}`, {
      averageLevel: totalLevel / entries.length,
      averageSkills,
      trackedCharacters: entries.length,
    })
  }

  // считает кто в гильдии сколько "прогрессировал"
  static async getGuildActivity(guildId: string) {
    const cached = getCached<
      Array<{
        userId: string
        memberName: string
        levelGain7d: number
        levelGain30d: number
        skillGain30d: number
        achievementsGain30d: number
        activityScore: number
      }>
    >(`activity:${guildId}`)
    if (cached) return cached

    const userIds = await getGuildMemberUserIds(guildId)
    const members = await prisma.guildMember.findMany({
      where: { guildId },
      select: { userId: true, name: true },
    })

    const characters = await prisma.character.findMany({
      where: { userId: { in: userIds } },
      include: {
        snapshots: {
          where: { createdAt: { gte: windowStart(THIRTY_DAYS_MS) } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    const byUser = new Map<
      string,
      {
        memberName: string
        levelGain7d: number
        levelGain30d: number
        skillGain30d: number
        achievementsGain30d: number
        activityScore: number
      }
    >()
    members.forEach((member) =>
      byUser.set(member.userId, {
        memberName: member.name,
        levelGain7d: 0,
        levelGain30d: 0,
        skillGain30d: 0,
        achievementsGain30d: 0,
        activityScore: 0,
      }),
    )

    const threshold7d = windowStart(SEVEN_DAYS_MS)

    characters.forEach((character) => {
      if (character.snapshots.length < 2) return
      const entry = byUser.get(character.userId)
      if (!entry) return

      const first30 = character.snapshots[0]
      const last = character.snapshots[character.snapshots.length - 1]
      const last7 =
        [...character.snapshots]
          .reverse()
          .find((snap) => snap.createdAt <= threshold7d) ?? first30

      const firstSkills = parseSkills(first30.skills)
      const lastSkills = parseSkills(last.skills)
      const skillGain = Object.keys(lastSkills).reduce(
        (acc, key) => acc + ((lastSkills[key] ?? 0) - (firstSkills[key] ?? 0)),
        0,
      )

      entry.levelGain30d += last.level - first30.level
      entry.levelGain7d += last.level - last7.level
      entry.skillGain30d += skillGain
      entry.achievementsGain30d +=
        last.achievementsCount - first30.achievementsCount
      entry.activityScore =
        entry.levelGain30d * 1 +
        entry.levelGain7d * 0.7 +
        entry.skillGain30d * 0.3 +
        entry.achievementsGain30d * 0.2
    })

    return setCached(
      `activity:${guildId}`,
      Array.from(byUser.entries())
        .map(([userId, value]) => ({ userId, ...value }))
        .sort((a, b) => b.activityScore - a.activityScore),
    )
  }

  // Считает какие классы есть в гильдии
  static async getVocationDistribution(guildId: string) {
    const cached = getCached<
      Array<{ vocation: string; count: number; percentage: number }>
    >(`vocations:${guildId}`)
    if (cached) return cached

    const userIds = await getGuildMemberUserIds(guildId)
    const characters = await prisma.character.findMany({
      where: { userId: { in: userIds } },
      select: { vocation: true },
    })

    const total = characters.length
    const counts = characters.reduce<Record<string, number>>(
      (acc, character) => {
        const vocation = character.vocation?.trim() || 'Unknown'
        acc[vocation] = (acc[vocation] ?? 0) + 1
        return acc
      },
      {},
    )

    return setCached(
      `vocations:${guildId}`,
      Object.entries(counts)
        .map(([vocation, count]) => ({
          vocation,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count),
    )
  }

  // Сравнивает гильдию с сервером
  static async getServerComparison(guildId: string) {
    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
      select: { server: true },
    })
    const stats = await this.getGuildStats(guildId)
    const avgSkillValues = Object.values(stats.averageSkills)
    const guildAverageSkill =
      avgSkillValues.length > 0
        ? avgSkillValues.reduce((acc, value) => acc + value, 0) /
          avgSkillValues.length
        : 0

    const baseline =
      SERVER_BASELINES[guild?.server ?? ''] ?? SERVER_BASELINES.default
    const levelDiff = stats.averageLevel - baseline.averageLevel
    const skillDiff = guildAverageSkill - baseline.averageSkill

    return {
      server: guild?.server ?? 'Unknown',
      guild: {
        averageLevel: stats.averageLevel,
        averageSkill: guildAverageSkill,
      },
      serverAverage: baseline,
      diff: {
        level: {
          absolute: levelDiff,
          percentage: baseline.averageLevel
            ? (levelDiff / baseline.averageLevel) * 100
            : 0,
        },
        skill: {
          absolute: skillDiff,
          percentage: baseline.averageSkill
            ? (skillDiff / baseline.averageSkill) * 100
            : 0,
        },
      },
    }
  }

  // Еженедельный отчёт
  static async getWeeklyReport(guildId: string) {
    const [stats, activity] = await Promise.all([
      this.getGuildStats(guildId),
      this.getGuildActivity(guildId),
    ])

    const topPerformers = activity.slice(0, 5)
    const achievementsGained = activity.reduce(
      (acc, entry) => acc + entry.achievementsGain30d,
      0,
    )
    const averageActivityScore =
      activity.length > 0
        ? activity.reduce((acc, entry) => acc + entry.activityScore, 0) /
          activity.length
        : 0

    return {
      generatedAt: new Date(),
      averageStats: stats,
      topPerformers,
      newAchievementsSummary: {
        totalGained30d: achievementsGained,
      },
      activityOverview: {
        averageActivityScore,
        trackedMembers: activity.length,
      },
    }
  }
}
