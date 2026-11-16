/**
 * Espelho do catálogo autoritativo em apps/api/src/domain.ts.
 * O backend sempre valida o valor recebido; este catálogo só organiza o
 * onboarding e evita que a interface ofereça posições inválidas.
 */
export const POSITIONS_BY_UNIT = {
  ofensiva: ['QB', 'RB', 'FB', 'WR', 'TE', 'OL'],
  defesa: ['DL', 'LB', 'CB', 'S'],
} as const

export type PlayerRegistrationPosition =
  (typeof POSITIONS_BY_UNIT)[keyof typeof POSITIONS_BY_UNIT][number]
