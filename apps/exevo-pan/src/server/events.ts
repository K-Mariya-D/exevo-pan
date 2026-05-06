import { TRPCError } from '@trpc/server'
import { authedProcedure } from 'server/trpc'
import { z } from 'zod'
import { prisma } from 'lib/prisma'
import { IntegrationsClient, LootCalculatorClient } from 'services/server'
import { isLeaderRole, isOfficerRole } from './guild/permissions'
import { apiSuccess } from './api'

const eventInput = z.object({
  guildId: z.string(),
  type: z.union([z.literal('HUNT'), z.literal('RAID')]),
  title: z.string().min(1).max(80),
  description: z.string().max(1000).optional(),
  location: z.string().max(120).optional(),
  scheduledAt: z.date(),
})

const requireGuildMember = async (guildId: string, userId: string) => {
  const member = await prisma.guildMember.findFirst({
    where: { guildId, userId },
    select: { id: true, role: true, userId: true },
  })
  if (!member) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Insufficient privileges in this guild',
    })
  }
  return member
}

export const createEvent = authedProcedure
  .input(eventInput)
  .mutation(async ({ ctx: { token }, input }) => {
    const member = await requireGuildMember(input.guildId, token.id)
    if (!isLeaderRole(member.role) && !isOfficerRole(member.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only leader or officer can create events',
      })
    }

    const createdEvent = await prisma.event.create({
      data: {
        guildId: input.guildId,
        type: input.type,
        title: input.title.trim(),
        description: input.description?.trim(),
        location: input.location?.trim(),
        scheduledAt: input.scheduledAt,
        status: 'UPCOMING',
        createdBy: token.id,
      },
    })

    await IntegrationsClient.notifyGuildMembers({
      guildId: createdEvent.guildId,
      title: 'New event created',
      body: createdEvent.title,
    }).catch(() => undefined)

    return apiSuccess(createdEvent)
  })

export const getEvent = authedProcedure
  .input(z.object({ eventId: z.string() }))
  .query(async ({ ctx: { token }, input: { eventId } }) => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: true,
        result: true,
      },
    })
    if (!event)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    await requireGuildMember(event.guildId, token.id)
    return apiSuccess(event)
  })

export const listGuildEvents = authedProcedure
  .input(z.object({ guildId: z.string() }))
  .query(async ({ ctx: { token }, input: { guildId } }) => {
    await requireGuildMember(guildId, token.id)
    return apiSuccess(
      await prisma.event.findMany({
        where: { guildId },
        select: {
          id: true,
          guildId: true,
          type: true,
          title: true,
          description: true,
          location: true,
          status: true,
          scheduledAt: true,
          createdBy: true,
          createdAt: true,
          result: {
            select: {
              totalLoot: true,
              expenses: true,
              profit: true,
            },
          },
          _count: {
            select: { participants: true },
          },
        },
        orderBy: { scheduledAt: 'desc' },
      }),
    )
  })

export const updateEvent = authedProcedure
  .input(
    z.object({
      eventId: z.string(),
      status: z
        .union([
          z.literal('UPCOMING'),
          z.literal('COMPLETED'),
          z.literal('CANCELLED'),
        ])
        .optional(),
      title: z.string().min(1).max(80).optional(),
      description: z.string().max(1000).optional(),
      location: z.string().max(120).optional(),
      scheduledAt: z.date().optional(),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { eventId, ...data } }) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    const member = await requireGuildMember(event.guildId, token.id)
    const canEdit =
      event.createdBy === token.id ||
      isLeaderRole(member.role) ||
      isOfficerRole(member.role)
    if (!canEdit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient privileges to edit event',
      })
    }

    return apiSuccess(
      await prisma.event.update({
        where: { id: eventId },
        data: {
          ...data,
          title: data.title?.trim(),
          description: data.description?.trim(),
          location: data.location?.trim(),
        },
      }),
    )
  })

export const deleteEvent = authedProcedure
  .input(z.object({ eventId: z.string() }))
  .mutation(async ({ ctx: { token }, input: { eventId } }) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    const member = await requireGuildMember(event.guildId, token.id)
    if (!isLeaderRole(member.role) && !isOfficerRole(member.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only leader/officer can delete events',
      })
    }
    return apiSuccess(await prisma.event.delete({ where: { id: eventId } }))
  })

export const joinEvent = authedProcedure
  .input(z.object({ eventId: z.string(), characterId: z.string().optional() }))
  .mutation(async ({ ctx: { token }, input: { eventId, characterId } }) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    await requireGuildMember(event.guildId, token.id)
    return apiSuccess(
      await prisma.eventParticipant.upsert({
        where: { eventId_userId: { eventId, userId: token.id } },
        update: { characterId: characterId ?? null },
        create: {
          eventId,
          userId: token.id,
          characterId,
          attended: false,
        },
      }),
    )
  })

export const leaveEvent = authedProcedure
  .input(z.object({ eventId: z.string() }))
  .mutation(async ({ ctx: { token }, input: { eventId } }) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    await requireGuildMember(event.guildId, token.id)
    const existing = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId: token.id } },
    })
    if (!existing)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Participant not found',
      })
    return apiSuccess(
      await prisma.eventParticipant.delete({ where: { id: existing.id } }),
    )
  })

export const markEventAttendance = authedProcedure
  .input(
    z.object({
      eventId: z.string(),
      userId: z.string(),
      attended: z.boolean(),
    }),
  )
  .mutation(
    async ({ ctx: { token }, input: { eventId, userId, attended } }) => {
      const event = await prisma.event.findUnique({ where: { id: eventId } })
      if (!event)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      const member = await requireGuildMember(event.guildId, token.id)
      const canManageAttendance =
        event.createdBy === token.id ||
        isLeaderRole(member.role) ||
        isOfficerRole(member.role)
      if (!canManageAttendance) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only organizer/leader/officer can mark attendance',
        })
      }

      const participant = await prisma.eventParticipant.findUnique({
        where: { eventId_userId: { eventId, userId } },
      })
      if (!participant)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Participant not found',
        })

      return apiSuccess(
        await prisma.eventParticipant.update({
          where: { id: participant.id },
          data: { attended },
        }),
      )
    },
  )

export const setEventLoot = authedProcedure
  .input(
    z.object({
      eventId: z.string(),
      totalLoot: z.number().min(0),
      expenses: z.number().min(0).optional().default(0),
    }),
  )
  .mutation(
    async ({ ctx: { token }, input: { eventId, totalLoot, expenses } }) => {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { participants: true },
      })
      if (!event)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
      const member = await requireGuildMember(event.guildId, token.id)
      if (!isLeaderRole(member.role) && !isOfficerRole(member.role)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only leader/officer can set loot result',
        })
      }
      if (event.status !== 'COMPLETED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Loot distribution only after event completion',
        })
      }

      const distribution = LootCalculatorClient.calculateDistribution({
        totalLoot,
        expenses,
        participants: event.participants.map((participant) => ({
          userId: participant.userId,
          attended: participant.attended,
        })),
      })

      return apiSuccess(
        await prisma.eventResult.upsert({
          where: { eventId },
          update: {
            totalLoot,
            expenses,
            profit: distribution.profit,
            distribution,
          },
          create: {
            eventId,
            totalLoot,
            expenses,
            profit: distribution.profit,
            distribution,
          },
        }),
      )
    },
  )

export const distributeEventLoot = authedProcedure
  .input(z.object({ eventId: z.string() }))
  .mutation(async ({ ctx: { token }, input: { eventId } }) => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { result: true },
    })
    if (!event)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    const member = await requireGuildMember(event.guildId, token.id)
    if (!isLeaderRole(member.role) && !isOfficerRole(member.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only leader/officer can distribute loot',
      })
    }
    if (!event.result) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Event loot result not found',
      })
    }

    return apiSuccess({
      distributed: true,
      eventId,
      snapshot: event.result.distribution,
    })
  })
