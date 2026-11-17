# Relatório QA-06 — QA final 02.1 do cadastro (UI)

Data: 2026-11-17. Branch `qa`. Incorporação de `review/02.1-cadastro-ui` em `0bdb89b`
(merge `7ca4934`, `--no-ff`, sem conflito). Inclui os commits de produto `9055124`
(web, S0/S1 da revisão) e `a042469` (UX, fluxo e protótipo), além de `b955761`.

**Veredito: Needs changes.** Nenhum S0 aberto e nenhuma regressão funcional. Faltam:
(a) o `REVIEW-02.1-CADASTRO-UI.md` ainda diz `Block` e lista como pendente o que o web já
corrigiu; (b) dois S2 abertos (landmark `main` e rótulo `Reenviar código`).

## Escopo e restrições

- Nenhum arquivo de `apps/web`, `apps/api`, `docs/design` ou `.scratch` foi editado.
- Alterações de teste (dentro de `e2e/`): ver seção 4.

## 1. Resultados

| Verificação | Resultado |
| --- | --- |
| `npm test` (api 31/31, web 120/120) | verde, exit 0 |
| `npm run build` (api tsc + web tsc -b + vite) | verde, exit 0 |
| `npm run lint` (oxlint) | 0 erros; 1 aviso pré-existente `AuthProvider.tsx:55` |
| `tsc -p e2e/tsconfig.json` | verde, exit 0 |
| Playwright, Postgres 17 em Podman, banco `playbook_e2e` zerado | **130 verdes, 0 vermelhos, 32 `fixme`** (65 casos ativos × 2 projetos; 16 `fixme` × 2) |
| Repetição `--repeat-each=3` (cadastro, acessibilidade, revisão 02.1) | 192/192 verdes, sem flaky |

Projetos: `mobile-chromium` (Pixel 7) e `desktop-chromium` (1280×800), ambos Chromium.
Podman rodou só o Postgres; o Playwright rodou no host. Na primeira tentativa a máquina
Podman estava parada e foi reiniciada (`podman machine start`); sem efeito nos resultados.

## 2. Achados da revisão 02.1 × evidência automatizada

| ID | Achado | Status atual | Evidência |
| --- | --- | --- | --- |
| S0-01 | Posições com 36px | **Resolvido** | `todos os 10 botões ... 44×44px` (ambos projetos) |
| S0-02 | Posição marcada sem indicador/contraste | **Resolvido** | `✓ QB` no nome acessível; fundo marcado ≠ não marcado (poll, por causa da transição de 150ms) |
| S0-03 | "Equipe" e código do time fixo | **Resolvido** | `Time atual: Navigators` somente leitura; `Código do time:` editável = `NAVS-2026`; código `XXXX-0000` volta à etapa de dados com alerta |
| S1-01 | `Staff ()` na Home pendente | **Resolvido** | Home sem `Staff ()`, com `Admin ou Head Coach` e `Sair da conta` |
| S1-02 | Sem Voltar e sem erro na etapa de papel | **Resolvido** | `Voltar` leva à etapa do código; falha 500 ao confirmar Staff mostra `alert` na etapa de papel |
| S1-03 | Código de 6 dígitos sem tabular | **Resolvido** | `font-variant-numeric: tabular-nums` no campo `Código de verificação` |
| S1-04 | Google com texto truncado e `role="img"` | **Resolvido** | botão com nome `Entrar com o Google` (texto visível = nome); `role="img"` removido |
| S1-05 | Campo de time `disabled`; erro sem `aria-describedby` | **Resolvido** | `aria-describedby` no código; campo somente leitura não é `disabled` |
| S1-06 | Hover/focus com azul legado | **Resolvido** | `.ui-btn` e `.ui-input` usam `--primary-hover`/`--ring-focus` |
| S1-07 | Fluxo/protótipo fora de ordem | **Resolvido em `docs/design`** | ver seção 3 |
| S2-01 | `text-wrap` ausente | **Resolvido** | `text-wrap: balance` e `pretty` em `index.css` |
| S2-02 | Microcopy dos botões de papel | **Resolvido** | subtítulos em `Jogador` e `Staff` |
| S2-03 | Sem `<main>` nas telas de entrada | **Aberto** | `fixme` em `cadastro-revisao-02-1.spec.ts` (`div.auth-layout`) |
| S2-04 | `Reenviar código` só volta ao e-mail | **Aberto** | `AuthScreen.tsx:347`, `setStep('email')` sem reenvio; rótulo enganoso |

Verificações extras que passaram:

- Fluxo de OTP errado no cadastro (`000000`) volta à etapa do código com `Código inválido ou expirado`.
- Teclado: login e cadastro de jogador completos só com Tab, Enter e Espaço (ambos projetos).
- Protótipo (`docs/design/prototype/index.html`), aberto em `file://`: os 10 `.position-toggle` visíveis no `#onboarding-dialog` medem 44×44px em 390×844 e 1440×1024, sem overflow horizontal.

## 3. Sincronização de documentos (`docs/design`)

- `flows/cadastro-e-papel.md` e `prototype/index.html`: **sincronizados** com a implementação.
  Time somente leitura, `Código do time` editável, `Voltar` na etapa de papel, `✓` nas
  posições, `Staff` sem parênteses vazios, `Entrar com o Google` completo.
- Vocabulário: nenhuma ocorrência de `Equipe` na UI do cadastro (somente as menções
  proibidas no próprio fluxo e no protótipo, como aviso).
- **Não sincronizado:** `REVIEW-02.1-CADASTRO-UI.md`
  - ainda marca `Veredito do Gate: Block` e `Decisão: Block`;
  - a matriz da seção 6.2 marca como `⏳ Pendente` no `apps/web` os itens S0-01 a S1-06
    que estão corrigidos (ver seção 2);
  - a seção 1.2 descreve a medição pré-correção (36px, `rgba(0,0,0,0)`).
  - Ação para UX: atualizar o veredito e a matriz com esta evidência, e registrar S2-03 e S2-04
    como abertos ou aceitos.
- `flows` descreve o mapeamento de erros: `400/409` voltam à etapa de dados e `401` à etapa
  do código. Os testes confirmam os dois casos.

## 4. Alterações de teste nesta rodada

Três testes ficaram vermelhos porque o contrato de UI mudou por decisão de produto
(S0-02 e S0-03). Eles foram atualizados ao contrato novo, não relaxados:

- `acessibilidade.spec.ts` (teclado e grupos de posição): a posição marcada passa a se
  chamar `✓ QB`. O seletor aceita `/^(✓ )?QB$/`. O teste do teclado agora passa pelo campo
  `Código do time` antes do nome.
- `cadastro.spec.ts` (antigo `Cadastro: equipe atual`): agora exige `Time atual: Navigators`
  somente leitura e `Código do time` editável com valor `NAVS-2026`.
- `support/pages/auth-page.ts`: comentário atualizado ao contrato novo.

Novo arquivo: `e2e/specs/cadastro-revisao-02-1.spec.ts` (10 casos × 2 projetos, mais 1 `fixme`).

## 5. Riscos e limites

- Não há checagem automatizada de contraste nem axe-core (limite já registrado no README).
- O erro 500 do Staff é simulado por `page.route`. É o único mock nesta rodada.
- O onboarding Google real continua fora (depende de credenciais externas).
- Os estados de loading dos botões não têm asserção dedicada além dos testes existentes.

## 6. Pendências para o time

1. UX: atualizar `REVIEW-02.1-CADASTRO-UI.md` com o veredito e a matriz pós-correção.
2. Web: S2-03 (`<main>` e safe-area nas telas de entrada) e S2-04 (rótulo ou ação de `Reenviar código`).
   Após a correção, remover o `fixme` de landmark.
3. Commit: testes e relatório em commits Conventional Commits (`test(e2e): ...`).
