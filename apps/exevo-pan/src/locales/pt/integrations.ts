import { defaultComposer } from 'default-composer'
import defaultTranslations from '../en/integrations'

export default defaultComposer(defaultTranslations, {
  Notifications: {
    eventCreated: 'Novo evento criado',
    eventStartingSoon: 'Evento vai comecar em breve',
    invitation: 'Novo convite',
    weeklyReport: 'Relatorio semanal',
  },
  Errors: {
    auctionSyncFailed: 'Falha ao sincronizar personagem pelo leilao',
    lootDistributionFailed: 'Falha ao calcular distribuicao de loot',
    notificationFailed: 'Falha ao enviar notificacoes',
  },
})
