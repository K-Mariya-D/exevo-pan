import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { Main } from 'templates'
import { trpc } from 'lib/trpc'
import { common, guilds } from 'locales'
import { useTranslations } from 'contexts/useTranslation'

type Props = {
  guildId: string
  userId: string
}

export default function GuildMemberPage({ guildId, userId }: Props) {
  const t = useTranslations().guilds
  const commonT = useTranslations().common
  const progress = trpc.getGuildProgress.useQuery({ guildId })

  const member = progress.data?.data?.members.find(
    (entry) => entry.userId === userId,
  )

  return (
    <>
      <Head>
        <title>{t.Meta.memberTitle}</title>
      </Head>
      <Main bestiaryBannerVariant={0.5}>
        <div className="inner-container py-8">
          <h1 className="mb-4 text-3xl">{t.member.heading}</h1>
          <p className="mb-4 font-bold">{member?.memberName ?? userId}</p>

          <h2 className="mb-2 text-xl">{t.member.characters}</h2>
          {progress.isLoading ? (
            <p>{commonT.genericLoading}</p>
          ) : progress.error ? (
            <p className="text-red-600">{commonT.genericError}</p>
          ) : member?.characters.length ? (
            <div className="grid gap-2">
              {member.characters.map((character) => (
                <div key={character.id} className="rounded border p-3">
                  <p>{character.name}</p>
                  <p className="text-sm opacity-70">
                    {t.member.levelShort} {character.latestSnapshot?.level ?? 0}
                  </p>
                  <p className="text-xs opacity-60">
                    {t.member.achievements}:{' '}
                    {character.latestSnapshot?.achievementsCount ?? 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>{t.member.noCharacters}</p>
          )}
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
  const userId = params?.userId
  if (typeof guildId !== 'string' || typeof userId !== 'string') {
    return { notFound: true }
  }

  return {
    props: {
      guildId,
      userId,
      translations: {
        common: common[locale as RegisteredLocale],
        guilds: guilds[locale as RegisteredLocale],
      },
      locale,
    },
  }
}
