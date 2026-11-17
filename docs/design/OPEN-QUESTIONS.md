# Questões de Produto em Aberto (`docs/design/OPEN-QUESTIONS.md`)

Registro das decisões de produto e de interface em que o spec (`.scratch/playbook/spec.md`), o glossário (`GLOSSARY.md`) ou os ADRs (`docs/adr/0001..0006`) admitem mais de uma interpretação ou não detalham a regra fina. Conforme diretriz de design, **nenhuma funcionalidade fora do spec foi inventada**; cada item abaixo documenta a dúvida e o comportamento conservador adotado no protótipo até decisão final.

---

## OQ-01 — Ponto de acesso do jogador à consulta do elenco (Histórias 13 e 14 vs. "A aba Elenco não aparece para jogador")

- **Contexto no spec**:
  - As histórias `13` e `14` determinam: *"Como jogador, quero ver o elenco do time com posições e unidades, para saber com quem conto em cada situação"* e *"Como jogador, quero ver o status dos companheiros (disponível, indisponível, lesionado, reformado), para entender quem está apto"*.
  - Ao mesmo tempo, a seção **Telas do MVP** (linha 183) e o **Seam 2** (linha 189) determinam expressamente: *"Elenco (somente staff: status, posições, filtros)... A aba Elenco não aparece para jogador"* e *"Elenco oculto ao jogador"*.
- **Questão**: Onde o jogador consulta a lista somente leitura dos companheiros (unidades, posições e status do elenco, sem observações internas nem justificativas) já que a aba principal **Elenco** é exclusiva do staff?
- **Adotado no protótipo**: A aba **Elenco** da barra de navegação principal fica estritamente oculta para o papel `jogador`. Para cumprir as histórias `13` e `14`, o jogador conta com um botão secundário `"Ver companheiros do elenco (somente leitura)"` dentro da tela **Perfil** (e no resumo da tela **Jogo**), que exibe apenas nome, unidade, posições e status do elenco, sem observações do staff e sem controles de edição.

---

## OQ-02 — Lista padronizada de motivos rápidos para justificativa de ausência (História 48)

- **Contexto no spec**:
  - A história `48` diz: *"Como jogador, quero escolher a justificativa de uma lista, para responder rápido pelo celular"*, e a história `49` complementa: *"Como jogador, quero complementar a justificativa com texto livre, para detalhar o que a lista não cobre"*.
- **Questão**: Quais são exatamente os itens canônicos da lista fechada de motivos rápidos no banco/API, e se o texto livre é obrigatório apenas quando a opção `"Outro"` é escolhida ou em qualquer recusa?
- **Adotado no protótipo**: Lista com 6 motivos comuns no futebol americano amador/universitário (`Trabalho / Escala`, `Saúde / Lesão`, `Estudo / Prova`, `Transporte / Deslocamento`, `Compromisso familiar`, `Outro motivo`), sendo o complemento em texto livre opcional nos 5 primeiros e obrigatório ao selecionar `"Outro motivo"`.

---

## OQ-03 — Comportamento quando um cadastro de staff é "Recusado" pelo Head Coach (História 9)

- **Contexto no spec**:
  - O modelo de dados define `estado de aprovação (ativo | pendente | recusado)` na entidade `user` (linha 141) e a história `9` define *"Como head coach, quero aprovar ou recusar cadastros de staff"*.
- **Questão**: Quando um head coach recusa uma solicitação de staff (`recusado`), a conta do usuário deve poder continuar no app convertida automaticamente para o papel `jogador`, ou permanece bloqueada com opção de solicitar reavaliação / apagar a conta?
- **Adotado no protótipo**: Exibe estado informativo de solicitação recusada com botão para `"Continuar como Jogador"` (escolhendo unidades e posições) ou `"Falar com o staff"`.

---

## OQ-04 — Visibilidade da "Observação" do status do elenco e da "Data prevista de retorno" para outros jogadores (Histórias 14, 16 e 17)

- **Contexto no spec**:
  - A história `14` diz que o jogador vê o status dos companheiros (`disponivel`, `indisponivel`, `lesionado`, `reformado`). As histórias `16` e `17` permitem ao staff registrar `observação` no status e `data prevista de retorno` quando `lesionado`. A história `54` protege dados de saúde e vida pessoal nas justificativas de evento.
- **Questão**: Na visão de jogador (ao ver o status dos companheiros — história 14), o jogador vê apenas o rótulo do status (`disponivel`, `indisponivel`, `lesionado`, `reformado`), ou também vê a `data prevista de retorno` e a `observação` cadastral? No próprio **Perfil** do jogador (história 20), ele vê a observação que o staff registrou sobre ele mesmo?
- **Adotado no protótipo**: Por simetria com a proteção de privacidade da história `54`, outros jogadores veem apenas o rótulo do status do elenco (`Disponível`, `Indisponível`, `Lesionado`, `Reformado`), enquanto a `observação` detalhada e a `data prevista de retorno` ficam visíveis para o **staff** e para o **próprio jogador** em seu **Perfil**.

---

## OQ-05 — Canal de contato com o staff pelo app (História 78)

- **Contexto no spec**:
  - A história `78` diz: *"Como usuário, quero entrar em contato com o staff pelo app quando não consigo responder, para não ficar sem canal"*.
- **Questão**: O envio desse contato dispara uma notificação (Web Push + e-mail) para os membros do staff / head coach a partir de um formulário curto dentro do app, ou redireciona para um canal configurado pelo time (e-mail do staff)?
- **Adotado no protótipo**: Formulário curto integrado na tela **Evento/Jogo** (quando o prazo está encerrado) e na tela **Perfil** (`"Enviar mensagem ao staff"`), que envia a mensagem para o staff via backend (notificação/e-mail) sem exigir sair do PWA.

---

## OQ-06 — Vinculação de jogador pré-cadastrado pelo staff quando ele cria a conta depois (Histórias 1 e 77)

- **Contexto no spec**:
  - A história `77` permite ao staff *"registrar um jogador que ainda não se cadastrou no elenco, para o elenco ficar completo antes de todos entrarem"*.
- **Questão**: O vínculo automático entre o registro prévio de `player` criado pelo staff e o novo `user` criado pelo jogador no auto-cadastro (história 1) ocorre por correspondência exata do **e-mail** informado no pré-cadastro, ou o jogador seleciona seu nome em uma lista de pré-cadastrados?
- **Adotado no protótipo**: No formulário `"Registrar jogador no elenco"` (tela **Elenco**), o staff informa `Nome`, `E-mail (opcional para vínculo automático)`, `Unidades`, `Posições` e `Status do elenco` inicial.

---

## OQ-07 — Simplificação do cadastro de staff: subpapel removido do onboarding

- **Contexto no spec**:
  - A issue `02` e o fluxo `cadastro-e-papel.md` determinam que o staff escolhe o subpapel (`head_coach`, `coordenador_ofensivo`, `coordenador_defensivo` e/ou `coordenador_special_teams`) no auto-cadastro e nasce `pendente` até aprovação de um head coach.
  - A implementação do backend no commit `6457129` removeu o envio de `staffRole` no `POST /auth/email/verify`; staff entra `pendente` sem subpapel auto-declarado e cabe ao head coach atribuir subpapéis posteriormente na tela **Elenco**.
- **Questão**: O protótipo e o spec devem ser atualizados para refletir que o staff não escolhe subpapel no auto-cadastro, ou o backend deve voltar a aceitar `staffRole` no verify?
- **Adotado no frontend (branch web)**: O onboarding de staff foi simplificado: ao escolher "Staff", a conta é criada imediatamente no estado `pendente`, sem tela de escolha de subpapel. A mensagem de pendência foi ajustada para "aguardando definição de um Admin ou Head Coach".

---

## OQ-08 — Escolha de unidades removida do cadastro de jogador

- **Contexto no spec**:
  - O fluxo `cadastro-e-papel.md` mostra o jogador escolhendo primeiro a unidade (`Ofensiva`, `Defesa` ou `Ambas`) e depois as posições, mantendo special teams visível para todo o time.
  - A implementação do backend no commit `6457129` espera apenas `positions?: string[]` no verify, deriva a unidade a partir da posição e rejeita posições de `special_teams` no cadastro.
- **Questão**: A interface deve continuar exibindo o seletor de unidades (Ofensiva/Defesa/Ambas) como no protótipo, filtrando as posições, ou pode ir direto para a escolha de posições agrupadas por unidade?
- **Adotado no frontend (branch web)**: A tela de posições lista diretamente as posições de ofensiva e defesa, agrupadas por unidade, sem seletor de unidades. O jogador pode selecionar zero ou mais posições (incluindo de ambas as unidades) e também pular a etapa.

---

## OQ-09 — Identidade visual do novo nome "SnapIn"

- **Contexto**: a atualização de branding (novembro/2026) definiu o nome visível do produto como **SnapIn** e o título do navegador como **"SnapIn: Gestão de Futebol Americano"**.
- **Questão**: não há definição de logo, ícone, cor da marca, ilustração de entrada ou diretriz tipográfica para o nome "SnapIn". O manifesto PWA continua apontando para `/icon.svg`, a tela de entrada não possui logotipo e a barra lateral mantém o emoji ⚓ com o nome do time ("Navigators FA").
- **Adotado**: foram atualizados apenas os textos visíveis do produto. Nenhum elemento gráfico foi criado ou alterado, para não inventar design fora do escopo da decisão de branding.
