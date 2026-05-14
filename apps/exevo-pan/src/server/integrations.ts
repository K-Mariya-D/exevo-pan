import { z } from 'zod'
import { authedProcedure } from 'server/trpc'
import { IntegrationsClient } from 'services/server'
import { apiSuccess, toTRPCError } from './api'
// Встраивает в систему персонажа из внешнего аукциона
export const syncCharacterFromAuction = authedProcedure
  .input(z.object({ auctionId: z.number().int().positive() }))
  .mutation(async ({ input: { auctionId } }) => {
    try {
      const synced = await IntegrationsClient.syncCharacterFromAuction(
        auctionId,
      )
      return apiSuccess(synced)
    } catch (error) {
      throw toTRPCError(error, 'Failed to sync character from auction')
    }
  })
// Считает распределение лута без записи в БД - для UI
export const distributeLootSnapshot = authedProcedure
  .input(
    z.object({
      totalLoot: z.number().min(0),
      expenses: z.number().min(0),
      participants: z.array(
        z.object({
          userId: z.string(),
          attended: z.boolean(),
        }),
      ),
    }),
  )
  .mutation(async ({ input }) => {
    try {
      const distribution = IntegrationsClient.calculateLootDistribution(input)
      return apiSuccess(distribution)
    } catch (error) {
      throw toTRPCError(error, 'Failed to calculate loot distribution')
    }
  })
// Уведомление о создании события
export const notifyEventCreated = authedProcedure
  .input(
    z.object({
      guildId: z.string(),
      eventTitle: z.string().min(1),
      url: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { guildId, eventTitle, url } }) => {
    try {
      const notified = await IntegrationsClient.notifyGuildMembers({
        guildId,
        title: 'New event created',
        body: eventTitle,
        url,
      })
      return apiSuccess({ notified })
    } catch (error) {
      throw toTRPCError(error, 'Failed to notify event creation')
    }
  })
// Уведомление о скором начале события
export const notifyEventStartingSoon = authedProcedure
  .input(
    z.object({
      guildId: z.string(),
      eventTitle: z.string().min(1),
      url: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { guildId, eventTitle, url } }) => {
    try {
      const notified = await IntegrationsClient.notifyGuildMembers({
        guildId,
        title: 'Event starting soon',
        body: eventTitle,
        url,
      })
      return apiSuccess({ notified })
    } catch (error) {
      throw toTRPCError(error, 'Failed to notify event start')
    }
  })
// Уведомление о приглашении в гильдию
export const notifyGuildInvitation = authedProcedure
  .input(
    z.object({
      guildId: z.string(),
      invitedName: z.string().min(1),
      url: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { guildId, invitedName, url } }) => {
    try {
      const notified = await IntegrationsClient.notifyGuildMembers({
        guildId,
        title: 'New invitation',
        body: invitedName,
        url,
      })
      return apiSuccess({ notified })
    } catch (error) {
      throw toTRPCError(error, 'Failed to notify invitation')
    }
  })
// Уведомлении о недельном отчёте
export const notifyWeeklyReport = authedProcedure
  .input(
    z.object({
      guildId: z.string(),
      summary: z.string().min(1),
      url: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { guildId, summary, url } }) => {
    try {
      const notified = await IntegrationsClient.notifyGuildMembers({
        guildId,
        title: 'Weekly report',
        body: summary,
        url,
      })
      return apiSuccess({ notified })
    } catch (error) {
      throw toTRPCError(error, 'Failed to notify weekly report')
    }
  })
