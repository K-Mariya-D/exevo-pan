import { defaultComposer } from 'default-composer'
import defaultTranslations from '../en/guilds'

export default defaultComposer(defaultTranslations, {
  Meta: {
    listTitle: 'Guilds',
    profileTitle: 'Perfil de guild',
    memberTitle: 'Miembro',
  },
  list: {
    heading: 'Lista de guilds',
    searchPlaceholder: 'Buscar guilds',
    createHeading: 'Crear guild',
    name: 'Nombre',
    server: 'Servidor',
    private: 'Guild privada',
    create: 'Crear',
    open: 'Abrir',
  },
  profile: {
    members: 'Miembros',
    events: 'Eventos',
    stats: 'Estadisticas',
    management: 'Gestion',
    addMember: 'Agregar miembro',
    createEvent: 'Crear evento',
    updateRole: 'Actualizar rol',
    removeMember: 'Quitar miembro',
    viewMember: 'Ver',
    averageLevel: 'Nivel promedio',
    trackedMembers: 'Miembros rastreados',
    vocationsTracked: 'Vocaciones rastreadas',
    levelProgression: 'Progresion de nivel',
    vocationDistribution: 'Distribucion de vocaciones',
    userIdPlaceholder: 'ID de usuario',
    role: {
      leader: 'Lider',
      officer: 'Oficial',
      member: 'Miembro',
    },
  },
  member: {
    heading: 'Detalle de miembro',
    characters: 'Personajes',
    noCharacters: 'Sin personajes rastreados',
    levelShort: 'lvl',
    achievements: 'logros',
  },
})
