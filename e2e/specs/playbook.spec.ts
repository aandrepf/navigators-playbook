import { expect, openAs, test } from '../support/fixtures'

test.describe('Consulta de jogada', () => {
  test('tela do playbook abre para jogador com busca por nome', async ({ page, jogador }) => {
    // Smoke da tela. Os dados ainda são estáticos no front (sem GET de jogadas
    // em docs/api), então este teste não prova visibilidade: só que a tela existe.
    await openAs(page, jogador, '/playbook')
    // Marca do produto (h1) é SnapIn; a seção do playbook é o h2 "Playbook".
    await expect(page.getByRole('heading', { name: 'Playbook', level: 2 })).toBeVisible()
    await expect(page.getByLabel('Buscar jogada por nome:')).toBeVisible()
  })

  test.fixme('jogador vê só as jogadas da sua unidade, agrupadas por unidade', async () => {
    // BLOQUEADO: listagem de jogadas (GET de jogadas com visibilidade do solicitante)
    // ainda não está em docs/api. Regra: ADR-0006 e stories 24–25, 34.
  })

  test.fixme('special teams aparece para todo o time, inclusive para quem é só ofensiva', async () => {
    // BLOQUEADO: depende da listagem de jogadas. Regra: ADR-0006, story 27.
  })

  test.fixme('jogada não visível para a unidade não aparece nem por URL direta', async () => {
    // BLOQUEADO: depende do detalhe de jogada (GET /plays/:id) em docs/api.
    // Deve responder 404 ou 403 sem vazar o conteúdo. Stories 24–26.
  })

  test.fixme('jogada alterada desde o último acesso mostra o selo de novidade', async () => {
    // BLOQUEADO: novidade depende de versão da jogada e marcação de estudo. Story 36–37.
  })

  test.fixme('busca e filtros por formação e situação encontram a jogada', async () => {
    // BLOQUEADO: busca e filtros dependem da listagem de jogadas. Stories 38–39.
  })
})
