type LootParticipant = {
  userId: string
  attended: boolean
}

type LootDistributionArgs = {
  totalLoot: number
  expenses: number
  participants: LootParticipant[]
}

export default class LootCalculatorClient {
  static calculateDistribution({
    totalLoot,
    expenses,
    participants,
  }: LootDistributionArgs): {
    profit: number
    eligibleCount: number
    splitPerMember: number
    perUser: Record<string, number>
  } {
    const profit = totalLoot - expenses
    const eligible = participants.filter((participant) => participant.attended)
    const eligibleCount = eligible.length
    const splitPerMember =
      eligibleCount > 0 ? Math.floor(profit / eligibleCount) : 0

    const perUser = eligible.reduce<Record<string, number>>(
      (acc, participant) => {
        acc[participant.userId] = splitPerMember
        return acc
      },
      {},
    )

    return {
      profit,
      eligibleCount,
      splitPerMember,
      perUser,
    }
  }
}
