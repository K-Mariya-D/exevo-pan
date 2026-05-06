import type { GUILD_MEMBER_ROLE } from '@prisma/client'

type PermissionSet = {
  exclude: (role: GUILD_MEMBER_ROLE) => boolean
  editGuild: boolean
  manageApplications: boolean
  manageRoles: boolean
  markAsNoChance: boolean
}

export const can: Record<GUILD_MEMBER_ROLE, PermissionSet> = {
  ADMIN: {
    exclude: (role) =>
      new Set<GUILD_MEMBER_ROLE>(['MODERATOR', 'USER']).has(role),
    editGuild: true,
    manageApplications: true,
    manageRoles: true,
    markAsNoChance: true,
  },
  MODERATOR: {
    exclude: (role) => new Set<GUILD_MEMBER_ROLE>(['USER']).has(role),
    editGuild: true,
    manageApplications: true,
    manageRoles: false,
    markAsNoChance: true,
  },
  USER: {
    exclude: (role) => new Set<GUILD_MEMBER_ROLE>([]).has(role),
    editGuild: false,
    manageApplications: false,
    manageRoles: false,
    markAsNoChance: true,
  },
  LEADER: {
    exclude: (role) =>
      new Set<GUILD_MEMBER_ROLE>([
        'OFFICER',
        'MEMBER',
        'MODERATOR',
        'USER',
      ]).has(role),
    editGuild: true,
    manageApplications: true,
    manageRoles: true,
    markAsNoChance: true,
  },
  OFFICER: {
    exclude: (role) => new Set<GUILD_MEMBER_ROLE>(['MEMBER', 'USER']).has(role),
    editGuild: true,
    manageApplications: true,
    manageRoles: false,
    markAsNoChance: true,
  },
  MEMBER: {
    exclude: () => false,
    editGuild: false,
    manageApplications: false,
    manageRoles: false,
    markAsNoChance: true,
  },
}

export const isLeaderRole = (role: GUILD_MEMBER_ROLE): boolean =>
  role === 'ADMIN' || role === 'LEADER'

export const isOfficerRole = (role: GUILD_MEMBER_ROLE): boolean =>
  role === 'MODERATOR' || role === 'OFFICER'

export const isMemberRole = (role: GUILD_MEMBER_ROLE): boolean =>
  role === 'USER' || role === 'MEMBER'
