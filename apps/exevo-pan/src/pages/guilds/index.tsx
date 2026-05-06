import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Main } from 'templates'
import { trpc } from 'lib/trpc'
import { guildClientPaths } from 'services/client/Guilds'
import { GetServerSideProps } from 'next'
import { common, guilds } from 'locales'
import { useTranslations } from 'contexts/useTranslation'

export default function GuildListPage() {
  const t = useTranslations().guilds
  const commonT = useTranslations().common
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [server, setServer] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const utils = trpc.useContext()
  const router = useRouter()

  const list = trpc.listGuilds.useQuery({ name: search, pageSize: 50 })
  const createGuild = trpc.createGuild.useMutation({
    onSuccess: async (created) => {
      await utils.listGuilds.invalidate()
      router.push(guildClientPaths.profile(created.id)).catch(() => undefined)
    },
  })

  return (
    <>
      <Head>
        <title>{t.Meta.listTitle}</title>
      </Head>
      <Main bestiaryBannerVariant={0.5}>
        <div className="inner-container py-8">
          <h1 className="mb-4 text-3xl">{t.list.heading}</h1>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.list.searchPlaceholder}
            className="mb-6 w-full rounded border px-3 py-2"
          />

          <div className="mb-8 grid gap-2 rounded border p-4 md:grid-cols-4">
            <h2 className="md:col-span-4">{t.list.createHeading}</h2>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t.list.name}
              className="rounded border px-3 py-2"
            />
            <input
              value={server}
              onChange={(event) => setServer(event.target.value)}
              placeholder={t.list.server}
              className="rounded border px-3 py-2"
            />
            <label htmlFor="guild-private" className="flex items-center gap-2">
              <input
                id="guild-private"
                type="checkbox"
                checked={isPrivate}
                onChange={(event) => setIsPrivate(event.target.checked)}
              />
              {t.list.private}
            </label>
            <button
              type="button"
              className="bg-primary rounded px-4 py-2 text-white disabled:opacity-50"
              disabled={!name || !server || createGuild.isLoading}
              onClick={() =>
                createGuild.mutate({
                  name,
                  server,
                  private: isPrivate,
                  description: '',
                  avatarId: 0,
                  avatarDegree: 30,
                })
              }
            >
              {t.list.create}
            </button>
          </div>

          <div className="grid gap-2">
            {list.isLoading && <p>{commonT.genericLoading}</p>}
            {list.error && (
              <div className="rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
                {commonT.genericError}
              </div>
            )}
            {list.data?.page.map((guild) => (
              <div
                key={guild.id}
                className="flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">{guild.name}</p>
                  <p className="text-sm opacity-70">{guild.server}</p>
                </div>
                <Link href={guildClientPaths.profile(guild.id)}>
                  {t.list.open}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    translations: {
      common: common[locale as RegisteredLocale],
      guilds: guilds[locale as RegisteredLocale],
    },
    locale,
  },
})
