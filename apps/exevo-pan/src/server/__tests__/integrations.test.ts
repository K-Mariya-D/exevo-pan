import { integrations } from 'locales'

describe('integrations localization baseline', () => {
  it('provides notification keys in all supported locales', () => {
    const locales: RegisteredLocale[] = ['en', 'pt', 'es', 'pl']

    locales.forEach((locale) => {
      expect(integrations[locale].Notifications.eventCreated).toBeTruthy()
      expect(integrations[locale].Notifications.eventStartingSoon).toBeTruthy()
      expect(integrations[locale].Notifications.invitation).toBeTruthy()
      expect(integrations[locale].Notifications.weeklyReport).toBeTruthy()
    })
  })

  it('provides integration error keys in all supported locales', () => {
    const locales: RegisteredLocale[] = ['en', 'pt', 'es', 'pl']

    locales.forEach((locale) => {
      expect(integrations[locale].Errors.auctionSyncFailed).toBeTruthy()
      expect(integrations[locale].Errors.lootDistributionFailed).toBeTruthy()
      expect(integrations[locale].Errors.notificationFailed).toBeTruthy()
    })
  })
})
