import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const
export type Role = typeof Role[keyof typeof Role]
export const REFERRAL_HISTORY_TYPE = {
  COMMISSION: 'COMMISSION',
  WITHDRAW: 'WITHDRAW',
} as const
export type REFERRAL_HISTORY_TYPE =
  typeof REFERRAL_HISTORY_TYPE[keyof typeof REFERRAL_HISTORY_TYPE]
export const PAYMENT_METHOD = {
  PIX: 'PIX',
  TIBIA_COINS: 'TIBIA_COINS',
} as const
export type PAYMENT_METHOD = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD]
export const CURRENCY = {
  BRL: 'BRL',
  TIBIA_COINS: 'TIBIA_COINS',
} as const
export type CURRENCY = typeof CURRENCY[keyof typeof CURRENCY]
export const TRANSACTION_TYPE = {
  EXEVO_PRO: 'EXEVO_PRO',
  AUCTION_HIGHLIGHT: 'AUCTION_HIGHLIGHT',
} as const
export type TRANSACTION_TYPE =
  typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE]
export const GUILD_MEMBER_ROLE = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
  LEADER: 'LEADER',
  OFFICER: 'OFFICER',
  MEMBER: 'MEMBER',
} as const
export type GUILD_MEMBER_ROLE =
  typeof GUILD_MEMBER_ROLE[keyof typeof GUILD_MEMBER_ROLE]
export const EVENT_TYPE = {
  HUNT: 'HUNT',
  RAID: 'RAID',
} as const
export type EVENT_TYPE = typeof EVENT_TYPE[keyof typeof EVENT_TYPE]
export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const
export type EVENT_STATUS = typeof EVENT_STATUS[keyof typeof EVENT_STATUS]
export const LOG_ENTRY_TYPE = {
  LEAVE_MEMBER: 'LEAVE_MEMBER',
  KICK_MEMBER: 'KICK_MEMBER',
  ACCEPT_MEMBER: 'ACCEPT_MEMBER',
  REJECT_MEMBER: 'REJECT_MEMBER',
  NOTIFICATION: 'NOTIFICATION',
  SET_AS_NO_CHANCE: 'SET_AS_NO_CHANCE',
} as const
export type LOG_ENTRY_TYPE = typeof LOG_ENTRY_TYPE[keyof typeof LOG_ENTRY_TYPE]
export type Account = {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}
export type AuctionNotification = {
  id: string
  auctionId: number
  nickname: string
  auctionEnd: Timestamp
  lastUpdated: Generated<Timestamp>
  notifyAt: Timestamp | null
  notifyOnBid: boolean
  scheduleCompleted: Generated<boolean>
  userId: string
}
export type BossCheck = {
  checkedAt: Timestamp
  boss: string
  guildId: string
  memberId: string
  lastSpawned: Timestamp | null
  location: string
}
export type BossCheckLog = {
  id: string
  checkedAt: Generated<Timestamp>
  boss: string
  location: string
  guildId: string
  memberId: string
}
export type CachedBossCheckStatistics = {
  guildId: string
  version: number
  cachedResponse: string
  lastUpdated: Timestamp
}
export type Character = {
  id: string
  userId: string
  externalId: string
  name: string
  vocation: string | null
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
}
export type CharacterSnapshot = {
  id: string
  characterId: string
  level: number
  skills: unknown | null
  achievementsCount: number
  createdAt: Generated<Timestamp>
}
export type Event = {
  id: string
  guildId: string
  type: EVENT_TYPE
  title: string
  description: string | null
  location: string | null
  status: Generated<EVENT_STATUS>
  scheduledAt: Timestamp
  createdBy: string
  createdAt: Generated<Timestamp>
}
export type EventParticipant = {
  id: string
  eventId: string
  userId: string
  characterId: string | null
  attended: Generated<boolean>
}
export type EventResult = {
  id: string
  eventId: string
  totalLoot: number
  expenses: Generated<number>
  profit: number
  distribution: unknown | null
  createdAt: Generated<Timestamp>
}
export type FrozenBossCheckLog = {
  id: string
  frozenAt: Generated<Timestamp>
  data: string
  guildId: string
}
export type Guild = {
  id: string
  name: string
  private: boolean
  server: string
  description: string | null
  messageBoard: string | null
  createdAt: Generated<Timestamp>
  avatarId: number
  avatarDegree: number
  eventEndpoint: string | null
}
export type GuildApplication = {
  id: string
  createdAt: Generated<Timestamp>
  applyAs: string
  message: string | null
  guildId: string
  userId: string
}
export type GuildLogEntry = {
  id: string
  createdAt: Generated<Timestamp>
  type: LOG_ENTRY_TYPE
  guildId: string
  actionGuildMemberId: string | null
  targetGuildMemberId: string | null
  metadata: string | null
}
export type GuildMember = {
  id: string
  name: string
  role: GUILD_MEMBER_ROLE
  joinedAt: Generated<Timestamp>
  guildId: string
  userId: string
  disabledNotifications: Generated<boolean>
  blacklistedBosses: string | null
}
export type HighlightedAuction = {
  id: string
  nickname: string
  auctionId: number
  auctionEnd: Generated<Timestamp>
  price: number
  days: string
  lastUpdated: Generated<Timestamp>
  active: Generated<boolean>
  confirmed: Generated<boolean>
  paymentMethod: PAYMENT_METHOD
  paymentCharacter: string | null
  email: string
  timezoneOffsetMinutes: Generated<number>
  userId: string | null
}
export type NotificationDevice = {
  auth: string
  endpoint: string
  p256dh: string
  lastUpdated: Generated<Timestamp>
  metadata: string | null
  userId: string
}
export type PastCachedBossCheckStatistics = {
  date_guildId: string
  version: number
  cachedResponse: string
}
export type PaymentData = {
  id: string
  lastUpdated: Timestamp
  character: string | null
  confirmed: boolean
  noBill: Generated<boolean>
  referralUserId: string | null
  discountPercent: number | null
  coupon: string | null
  userId: string
}
export type ReferralHistoryEntry = {
  id: string
  createdAt: Generated<Timestamp>
  type: REFERRAL_HISTORY_TYPE
  value: number
  withdrawnCharacter: string | null
  referredUserId: string | null
  userId: string
}
export type ReferralTag = {
  id: string
  tcIn: Generated<number>
  tcOut: Generated<number>
  discountPercent: number
  withdrawCharacter: Generated<string>
  coupon: Generated<string>
  userId: string
}
export type Session = {
  id: string
  sessionToken: string
  userId: string
  expires: Timestamp
}
export type Transaction = {
  id: string
  value: number
  currency: CURRENCY
  type: TRANSACTION_TYPE
  date: Generated<Timestamp>
  highlightedAuctionId: string | null
  exevoProPaymentId: string | null
  userId: string
}
export type User = {
  id: string
  role: Generated<Role>
  name: string | null
  email: string | null
  emailVerified: Timestamp | null
  image: string | null
  proStatus: Generated<boolean>
  proSince: Timestamp | null
}
export type VerificationToken = {
  identifier: string
  token: string
  expires: Timestamp
}
export type DB = {
  Account: Account
  AuctionNotification: AuctionNotification
  BossCheck: BossCheck
  BossCheckLog: BossCheckLog
  CachedBossCheckStatistics: CachedBossCheckStatistics
  Character: Character
  CharacterSnapshot: CharacterSnapshot
  Event: Event
  EventParticipant: EventParticipant
  EventResult: EventResult
  FrozenBossCheckLog: FrozenBossCheckLog
  Guild: Guild
  GuildApplication: GuildApplication
  GuildLogEntry: GuildLogEntry
  GuildMember: GuildMember
  HighlightedAuction: HighlightedAuction
  NotificationDevice: NotificationDevice
  PastCachedBossCheckStatistics: PastCachedBossCheckStatistics
  PaymentData: PaymentData
  ReferralHistoryEntry: ReferralHistoryEntry
  ReferralTag: ReferralTag
  Session: Session
  Transaction: Transaction
  User: User
  VerificationToken: VerificationToken
}
