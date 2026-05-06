import LootCalculatorClient from 'services/server/LootCalculator'

describe('loot calculator', () => {
  it('splits profit between attended participants', () => {
    const result = LootCalculatorClient.calculateDistribution({
      totalLoot: 1000,
      expenses: 100,
      participants: [
        { userId: 'u1', attended: true },
        { userId: 'u2', attended: true },
        { userId: 'u3', attended: false },
      ],
    })

    expect(result.profit).toBe(900)
    expect(result.eligibleCount).toBe(2)
    expect(result.splitPerMember).toBe(450)
    expect(result.perUser).toEqual({ u1: 450, u2: 450 })
  })

  it('returns zero split when nobody attended', () => {
    const result = LootCalculatorClient.calculateDistribution({
      totalLoot: 500,
      expenses: 50,
      participants: [{ userId: 'u1', attended: false }],
    })

    expect(result.profit).toBe(450)
    expect(result.eligibleCount).toBe(0)
    expect(result.splitPerMember).toBe(0)
    expect(result.perUser).toEqual({})
  })
})
