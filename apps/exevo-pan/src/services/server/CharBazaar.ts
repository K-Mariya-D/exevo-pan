import TibiaDataClient from 'services/TibiaData'

type CharBazaarCharacterData = {
  name: string
  level: number
  vocation: string
  skills?: Record<string, number>
  achievementsCount?: number
}

export default class CharBazaarClient {
  static async fetchCharacter(name: string): Promise<CharBazaarCharacterData> {
    const character = await TibiaDataClient.character(name)
    if (!character) {
      throw new Error(`Character '${name}' not found in Char Bazaar`)
    }

    return {
      name: character.name,
      level: character.level,
      vocation: character.vocation,
      // This provider currently does not return skill details.
      skills: {},
      achievementsCount: 0,
    }
  }
}
