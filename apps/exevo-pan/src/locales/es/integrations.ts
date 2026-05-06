import { defaultComposer } from 'default-composer'
import defaultTranslations from '../en/integrations'

export default defaultComposer(defaultTranslations, {
  Notifications: {
    eventCreated: 'Nuevo evento creado',
    eventStartingSoon: 'El evento comienza pronto',
    invitation: 'Nueva invitacion',
    weeklyReport: 'Reporte semanal',
  },
  Errors: {
    auctionSyncFailed: 'No se pudo sincronizar el personaje desde subasta',
    lootDistributionFailed: 'No se pudo calcular la distribucion de loot',
    notificationFailed: 'No se pudieron enviar notificaciones',
  },
})
