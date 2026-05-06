import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { db } from 'db'
import { useMemo, useState } from 'react'
import { trpc } from 'lib/trpc'
import { Main } from 'templates'
import { common, guilds } from 'locales'
import { useTranslations } from 'contexts/useTranslation'
import { guildClientPaths } from 'services/client/Guilds'

type Props = {
  guildId: string
  guildName: string
  initialMembers: Array<{
    id: string
    userId: string
    name: string
    role: string
  }>
}

export default function GuildProfilePage({
  guildId,
  guildName,
  initialMembers,
}: Props) {
  const t = useTranslations().guilds
  const commonT = useTranslations().common
  const [newUserId, setNewUserId] = useState('')
  const [newMemberName, setNewMemberName] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [managedMemberId, setManagedMemberId] = useState(
    initialMembers[0]?.id ?? '',
  )
  const [managedRole, setManagedRole] = useState<
    'LEADER' | 'OFFICER' | 'MEMBER'
  >('MEMBER')

  const events = trpc.listGuildEvents.useQuery({ guildId })
  const progress = trpc.getGuildProgress.useQuery({ guildId })
  const stats = trpc.getGuildStats.useQuery({ guildId })
  const vocations = trpc.getGuildVocations.useQuery({ guildId })

  const addMember = trpc.addGuildMember.useMutation()
  const createEvent = trpc.createEvent.useMutation()
  const manageRole = trpc.manageGuildMemberRole.useMutation()
  const removeMember = trpc.excludeGuildMember.useMutation()

  const levelProgression = useMemo(
    () =>
      (progress.data?.data?.members ?? [])
        .map((member) => {
          const totalLevel = member.characters.reduce(
            (acc, character) => acc + (character.latestSnapshot?.level ?? 0),
            0,
          )
          return { memberName: member.memberName, totalLevel }
        })
        .sort((a, b) => b.totalLevel - a.totalLevel),
    [progress.data?.data?.members],
  )

  const maxLevel = useMemo(
    () => levelProgression[0]?.totalLevel ?? 1,
    [levelProgression],
  )
  const vocationDistribution = useMemo(
    () => vocations.data?.data ?? [],
    [vocations.data?.data],
  )
  const hasError =
    !!events.error || !!progress.error || !!stats.error || !!vocations.error

  return (
    <>
      <Head>
        <title>{`${t.Meta.profileTitle} - ${guildName}`}</title>
      </Head>
      <Main bestiaryBannerVariant={0.5}>
        <div className="inner-container py-8">
          <h1 className="mb-6 text-3xl">{guildName}</h1>

          {hasError && (
            <div className="mb-6 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
              {commonT.genericError}
            </div>
          )}

          <section className="mb-8">
            <h2 className="mb-2 text-xl">{t.profile.members}</h2>
            <div className="grid gap-2">
              {initialMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <p>{member.name}</p>
                    <p className="text-xs opacity-70">{member.role}</p>
                  </div>
                  <Link href={guildClientPaths.member(guildId, member.userId)}>
                    {t.profile.viewMember}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-2 text-xl">{t.profile.events}</h2>
            <div className="grid gap-2">
              {events.isLoading && <p>{commonT.genericLoading}</p>}
              {events.data?.data?.map((event) => (
                <div key={event.id} className="rounded border p-3">
                  {event.title} - {event.status}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-2 text-xl">{t.profile.stats}</h2>
            {stats.isLoading || progress.isLoading || vocations.isLoading ? (
              <p>{commonT.genericLoading}</p>
            ) : (
              <div className="grid gap-4">
                <p>
                  {t.profile.averageLevel}:{' '}
                  {Number(stats.data?.data?.averageLevel ?? 0).toFixed(2)}
                </p>
                <p>
                  {t.profile.trackedMembers}:{' '}
                  {progress.data?.data?.members.length ?? 0}
                </p>
                <p>
                  {t.profile.vocationsTracked}:{' '}
                  {vocations.data?.data?.length ?? 0}
                </p>

                <div className="rounded border p-3">
                  <h3 className="mb-2 font-bold">
                    {t.profile.levelProgression}
                  </h3>
                  <div className="grid gap-2">
                    {levelProgression.map((entry) => (
                      <div
                        key={entry.memberName}
                        className="grid grid-cols-[120px_1fr_auto] items-center gap-2 text-sm"
                      >
                        <span className="truncate">{entry.memberName}</span>
                        <div className="h-2 rounded bg-gray-200">
                          <div
                            className="bg-primary h-2 rounded"
                            style={{
                              width: `${Math.max(
                                4,
                                (entry.totalLevel / maxLevel) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                        <span>{entry.totalLevel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded border p-3">
                  <h3 className="mb-2 font-bold">
                    {t.profile.vocationDistribution}
                  </h3>
                  <div className="grid gap-2">
                    {vocationDistribution.map((entry) => (
                      <div
                        key={entry.vocation}
                        className="grid grid-cols-[120px_1fr_auto] items-center gap-2 text-sm"
                      >
                        <span className="truncate">{entry.vocation}</span>
                        <div className="h-2 rounded bg-gray-200">
                          <div
                            className="h-2 rounded bg-green-600"
                            style={{
                              width: `${Math.max(4, entry.percentage)}%`,
                            }}
                          />
                        </div>
                        <span>{entry.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-xl">{t.profile.management}</h2>
            <div className="grid gap-3 rounded border p-4">
              <div className="grid gap-2 md:grid-cols-3">
                <input
                  value={newUserId}
                  onChange={(event) => setNewUserId(event.target.value)}
                  placeholder={t.profile.userIdPlaceholder}
                  className="rounded border px-3 py-2"
                />
                <input
                  value={newMemberName}
                  onChange={(event) => setNewMemberName(event.target.value)}
                  placeholder={t.profile.addMember}
                  className="rounded border px-3 py-2"
                />
                <button
                  type="button"
                  className="bg-primary rounded px-4 py-2 text-white"
                  onClick={() =>
                    addMember.mutate({
                      guildId,
                      userId: newUserId,
                      name: newMemberName,
                    })
                  }
                >
                  {t.profile.addMember}
                </button>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <input
                  value={eventTitle}
                  onChange={(event) => setEventTitle(event.target.value)}
                  placeholder={t.profile.createEvent}
                  className="rounded border px-3 py-2"
                />
                <button
                  type="button"
                  className="bg-primary rounded px-4 py-2 text-white"
                  onClick={() =>
                    createEvent.mutate({
                      guildId,
                      type: 'HUNT',
                      title: eventTitle,
                      description: '',
                      location: '',
                      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
                    })
                  }
                >
                  {t.profile.createEvent}
                </button>
              </div>

              <div className="grid gap-2 md:grid-cols-4">
                <select
                  value={managedMemberId}
                  onChange={(event) => setManagedMemberId(event.target.value)}
                  className="rounded border px-3 py-2"
                >
                  {initialMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <select
                  value={managedRole}
                  onChange={(event) =>
                    setManagedRole(event.target.value as typeof managedRole)
                  }
                  className="rounded border px-3 py-2"
                >
                  <option value="LEADER">{t.profile.role.leader}</option>
                  <option value="OFFICER">{t.profile.role.officer}</option>
                  <option value="MEMBER">{t.profile.role.member}</option>
                </select>
                <button
                  type="button"
                  className="bg-primary rounded px-4 py-2 text-white"
                  onClick={() =>
                    manageRole.mutate({
                      managedGuildMemberId: managedMemberId,
                      role: managedRole,
                    })
                  }
                >
                  {t.profile.updateRole}
                </button>
                <button
                  type="button"
                  className="rounded bg-red-600 px-4 py-2 text-white"
                  onClick={() =>
                    removeMember.mutate({
                      excludedGuildMemberId: managedMemberId,
                    })
                  }
                >
                  {t.profile.removeMember}
                </button>
              </div>
            </div>
          </section>
        </div>
      </Main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const guildId = params?.guildId
  if (typeof guildId !== 'string') return { notFound: true }

  const guild = await db
    .selectFrom('Guild')
    .select(['id', 'name'])
    .where('id', '=', guildId)
    .executeTakeFirst()

  if (!guild) return { notFound: true }

  const members = await db
    .selectFrom('GuildMember')
    .select(['id', 'userId', 'name', 'role'])
    .where('guildId', '=', guildId)
    .orderBy('joinedAt', 'asc')
    .execute()

  return {
    props: {
      guildId: guild.id,
      guildName: guild.name,
      initialMembers: members,
      translations: {
        common: common[locale as RegisteredLocale],
        guilds: guilds[locale as RegisteredLocale],
      },
      locale,
    },
  }
}
