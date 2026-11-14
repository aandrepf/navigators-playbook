import { test } from '../support/fixtures'

/*
 * Presença, justificativa, marcação de jogo e game plan. Nenhum desses fluxos tem
 * endpoint em docs/api ainda: as telas Evento e Jogo renderizam dados estáticos.
 * Os testes ficam marcados com `fixme` e o motivo do bloqueio, para o time saber
 * exatamente o que falta antes de liberar cada um. Não são falhas de teste.
 */

test.describe('Evento e presença', () => {
  test.fixme('jogador confirma presença e vê o estado registrado', async () => {
    // BLOQUEADO: POST de resposta de evento não está em docs/api. Stories 46, 57.
  })

  test.fixme('recusa exige justificativa e ela não aparece para o jogador', async () => {
    // BLOQUEADO: justificativa e consolidado de staff não estão em docs/api.
    // Regra: justificativa só para staff (GLOSSARY, story 54). Jogador vê "ausente".
  })

  test.fixme('resposta é bloqueada depois do prazo, exceto para staff', async () => {
    // BLOQUEADO: prazo de resposta depende de eventos (docs/api). Usar relógio
    // congelado (page.clock) quando a rota existir. Story 50.
  })

  test.fixme('staff vê confirmados, ausentes com justificativa e sem resposta', async () => {
    // BLOQUEADO: consolidado de evento para staff. Stories 52–53.
  })
})

test.describe('Jogo, marcação e game plan', () => {
  test.fixme('jogador marca disponibilidade para um jogo com justificativa na recusa', async () => {
    // BLOQUEADO: marcação de jogo (POST) não está em docs/api. Story 58–59.
  })

  test.fixme('staff cruza marcação com status do elenco ao montar a escalação', async () => {
    // BLOQUEADO: consolidado de jogo e status do elenco em docs/api. Story 61.
  })

  test.fixme('game plan mantém a ordem das jogadas e a nota por jogada', async () => {
    // BLOQUEADO: game plan por referência (ADR-0004) não está em docs/api. Stories 62–64.
  })
})
