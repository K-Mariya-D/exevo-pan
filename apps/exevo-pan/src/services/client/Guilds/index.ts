export const guildClientPaths = {
  list: '/guilds',
  profile: (guildId: string) => `/guilds/${guildId}`,
  member: (guildId: string, userId: string) =>
    `/guilds/${guildId}/members/${userId}`,
}
