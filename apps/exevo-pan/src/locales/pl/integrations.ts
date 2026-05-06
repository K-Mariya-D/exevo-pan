import { defaultComposer } from 'default-composer'
import defaultTranslations from '../en/integrations'

export default defaultComposer(defaultTranslations, {
  Notifications: {
    eventCreated: 'Utworzono nowe wydarzenie',
    eventStartingSoon: 'Wydarzenie rozpocznie sie wkrotce',
    invitation: 'Nowe zaproszenie',
    weeklyReport: 'Raport tygodniowy',
  },
  Errors: {
    auctionSyncFailed: 'Nie udalo sie zsynchronizowac postaci z aukcji',
    lootDistributionFailed: 'Nie udalo sie obliczyc podzialu lootu',
    notificationFailed: 'Nie udalo sie wyslac powiadomien',
  },
})
