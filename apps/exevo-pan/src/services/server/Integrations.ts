/* eslint-disable no-console */
import { prisma } from 'lib/prisma'
import AuctionsClient from './Auctions'
import LootCalculatorClient from './LootCalculator'
import DeviceNotificationClient from './DeviceNotification'

type NotifyGuildArgs = {
  guildId: string
  title: string
  body: string
  url?: string
}

export default class IntegrationsClient {
  static async syncCharacterFromAuction(auctionId: number) {
    const result = await AuctionsClient.fetchAuctionPage({
      filterOptions: { auctionIds: new Set([auctionId]) },
      paginationOptions: { pageSize: 1 },
      history: false,
    })
    const [character] = result.page
    if (!character) {
      throw new Error(`Auction ${auctionId} not found`)
    }

    return {
      externalId: String(character.id),
      name: character.nickname,
      level: character.level,
    }
  }

  static calculateLootDistribution = LootCalculatorClient.calculateDistribution

  static async notifyGuildMembers({
    guildId,
    title,
    body,
    url,
  }: NotifyGuildArgs): Promise<number> {
    const members = await prisma.guildMember.findMany({
      where: { guildId, disabledNotifications: false },
      include: { user: { select: { NotificationDevice: true } } },
    })
    const devices = members.flatMap((member) => member.user.NotificationDevice)

    await Promise.all(
      devices.map((device) =>
        DeviceNotificationClient.notify({
          device,
          notification: { title, body, url },
          deleteInvalidDevices: true,
        }).catch((error) => {
          console.log('Notification error:', error)
        }),
      ),
    )

    return devices.length
  }
}
