import { defaultComposer } from 'default-composer'
import defaultTranslations from '../en/guilds'

export default defaultComposer(defaultTranslations, {
  Meta: {
    listTitle: 'Guildas',
    profileTitle: 'Perfil da guilda',
    memberTitle: 'Membro',
  },
  list: {
    heading: 'Lista de guildas',
    searchPlaceholder: 'Buscar guildas',
    createHeading: 'Criar guilda',
    name: 'Nome',
    server: 'Servidor',
    private: 'Guilda privada',
    create: 'Criar',
    open: 'Abrir',
  },
  profile: {
    members: 'Membros',
    events: 'Eventos',
    stats: 'Estatisticas',
    management: 'Gerenciamento',
    addMember: 'Adicionar membro',
    createEvent: 'Criar evento',
    updateRole: 'Atualizar cargo',
    removeMember: 'Remover membro',
    viewMember: 'Ver',
    averageLevel: 'Nivel medio',
    trackedMembers: 'Membros rastreados',
    vocationsTracked: 'Vocacoes rastreadas',
    levelProgression: 'Progressao de nivel',
    vocationDistribution: 'Distribuicao de vocacoes',
    userIdPlaceholder: 'ID do usuario',
    role: {
      leader: 'Lider',
      officer: 'Oficial',
      member: 'Membro',
    },
  },
  member: {
    heading: 'Detalhes do membro',
    characters: 'Personagens',
    noCharacters: 'Sem personagens rastreados',
    levelShort: 'lvl',
    achievements: 'conquistas',
  },
})
