import { defaultComposer } from 'default-composer'
import defaultTranslations from '../en/guilds'

export default defaultComposer(defaultTranslations, {
  Meta: {
    listTitle: 'Gildie',
    profileTitle: 'Profil gildii',
    memberTitle: 'Czlonek',
  },
  list: {
    heading: 'Lista gildii',
    searchPlaceholder: 'Szukaj gildii',
    createHeading: 'Utworz gildie',
    name: 'Nazwa',
    server: 'Serwer',
    private: 'Prywatna gildia',
    create: 'Utworz',
    open: 'Otworz',
  },
  profile: {
    members: 'Czlonkowie',
    events: 'Wydarzenia',
    stats: 'Statystyki',
    management: 'Zarzadzanie',
    addMember: 'Dodaj czlonka',
    createEvent: 'Utworz wydarzenie',
    updateRole: 'Aktualizuj role',
    removeMember: 'Usun czlonka',
    viewMember: 'Zobacz',
    averageLevel: 'Sredni poziom',
    trackedMembers: 'Sledzeni czlonkowie',
    vocationsTracked: 'Sledzone profesje',
    levelProgression: 'Postep poziomu',
    vocationDistribution: 'Rozklad profesji',
    userIdPlaceholder: 'ID uzytkownika',
    role: {
      leader: 'Lider',
      officer: 'Oficer',
      member: 'Czlonek',
    },
  },
  member: {
    heading: 'Szczegoly czlonka',
    characters: 'Postacie',
    noCharacters: 'Brak sledzonych postaci',
    levelShort: 'lvl',
    achievements: 'osiagniecia',
  },
})
