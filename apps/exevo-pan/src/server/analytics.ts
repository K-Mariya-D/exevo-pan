import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure } from 'server/trpc'
import { AnalyticsClient } from 'services/server'
import { apiSuccess } from './api'
import { assertGuildAccess } from './guild/access'

const guildInput = z.object({ guildId: z.string() })

// Общая статистика гильдии
export const getGuildStats = authedProcedure
  .input(guildInput)
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    await assertGuildAccess(guildId, token.id, token.role === 'ADMIN')
    return apiSuccess(await AnalyticsClient.getGuildStats(guildId))
  })
// Список активности
export const getGuildActivity = authedProcedure
  .input(
    guildInput.extend({
      top: z.number().min(1).max(50).optional().default(10),
    }),
  )
  .query(async ({ ctx: { token }, input: { guildId, top } }) => {
    await assertGuildAccess(guildId, token.id, token.role === 'ADMIN')
    const activity = await AnalyticsClient.getGuildActivity(guildId)
    return apiSuccess(activity.slice(0, top))
  })
// Распределение игровых классов в гильдии
export const getGuildVocations = authedProcedure
  .input(guildInput)
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    await assertGuildAccess(guildId, token.id, token.role === 'ADMIN')
    return apiSuccess(await AnalyticsClient.getVocationDistribution(guildId))
  })
// Сравнении гильдии с показателями по серверу
export const getGuildComparison = authedProcedure
  .input(guildInput)
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    await assertGuildAccess(guildId, token.id, token.role === 'ADMIN')
    return apiSuccess(await AnalyticsClient.getServerComparison(guildId))
  })
// Еженедельный отчёт
export const getGuildReports = authedProcedure
  .input(guildInput)
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    await assertGuildAccess(guildId, token.id, token.role === 'ADMIN')
    const report = await AnalyticsClient.getWeeklyReport(guildId)
    return apiSuccess([{ id: 'latest', ...report }])
  })

export const getGuildReportById = authedProcedure
  .input(guildInput.extend({ reportId: z.string() }))
  .query(async ({ ctx: { token }, input: { guildId, reportId } }) => {
    await assertGuildAccess(guildId, token.id, token.role === 'ADMIN')
    if (reportId !== 'latest') {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Report not found' })
    }
    return apiSuccess({
      id: 'latest',
      ...(await AnalyticsClient.getWeeklyReport(guildId)),
    })
  })
