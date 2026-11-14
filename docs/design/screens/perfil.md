# Tela 6: Perfil (`docs/design/screens/perfil.md`)

## 1. Objetivo

Permitir que qualquer membro do time gerencie seus próprios dados e preferências de uso: para o **jogador**, consultar como seu **status do elenco** está registrado pelo staff, visualizar e corrigir suas **unidades** (`Ofensiva`, `Defesa` ou `Ambas`) e suas **posições** (múltiplas), e consultar a lista somente leitura de companheiros do elenco; para **jogador e staff**, controlar quais **notificações** recebe por Web Push (com aviso de instalação na tela inicial e e-mail como fallback), entrar em contato com o staff quando não consegue responder a um evento, **sair da conta** em aparelho compartilhado ou **apagar a própria conta**.

Histórias do spec atendidas: `4`, `5`, `6`, `11`, `12`, `13`, `14`, `20`, `72`, `73`, `74`, `78`, `79`.

---

## 2. Hierarquia Visual e Layout

### Mobile (`320px–767px`) — Cartões Temáticos Empilhados
1. **Cartão de Identidade e Papel**:
   - Nome completo, e-mail verificado (`✓ Confirmado`), método de acesso vinculado (`Código por e-mail` / `Conta Google`), **papel** (`Jogador` ou `Staff`) e, quando staff, seus **subpapéis** ativos (ex.: `Coordenador Ofensivo + Coordenador de Special Teams`).
2. **Cartão de Meu Status do Elenco (Visível para Jogador — História 20)**:
   - Exibe em destaque e em modo somente leitura o **status do elenco** atual atribuído pelo staff (`✓ Disponível`, `! Indisponível`, `+ Lesionado` com data prevista de retorno, ou `— Reformado`) e a eventual observação cadastral.
   - Nota explicativa: `"Seu status do elenco é atualizado pelo staff. Caso precise comunicar uma lesão ou mudança cadastral, fale com o staff abaixo."`
3. **Cartão de Unidades e Posições em Campo (Editável pelo Jogador — Histórias 4, 5, 6)**:
   - Seletor de **Unidade de atuação**: `Ofensiva`, `Defesa` ou `Ambas (Ofensiva e Defesa)` + indicação automática de que `Special teams` faz parte do playbook aberto a todo o time.
   - Seletor múltiplo de **Posições** (chips selecionáveis com `min-height: 44px` e `aria-pressed="true|false"`):
     - Ofensiva: `QB`, `RB`, `FB`, `WR`, `TE`, `OL (LT/LG/C/RG/RT)`
     - Defesa: `DL (DE/DT/NT)`, `LB (MLB/OLB)`, `CB`, `S (FS/SS)`
     - Special teams: `K`, `P`, `LS`, `KR/PR`, `Gunner`
   - Botão `"Salvar unidades e posições"` (atualiza imediatamente quais jogadas do playbook são exibidas para o jogador).
   - Botão secundário `"Ver companheiros do elenco (posições e status)"` que abre a lista somente leitura do elenco para o jogador (atendendo às histórias `13` e `14` sem expor a aba administrativa de Elenco).
4. **Cartão de Notificações Web Push e E-mail (Histórias 72, 73, 74)**:
   - Indicador do estado do dispositivo atual:
     - Se ainda não instalado como PWA na tela inicial (especialmente iOS): banner informativo `"Para receber notificações push no celular, instale o app na tela inicial"` com botão `"Como instalar na tela inicial"`.
     - Botão de gesto explícito: `"Ativar notificações push neste aparelho"`.
   - Chaves (`role="switch"`, `min-height: 44px`) para controlar quais avisos receber:
     - `Jogada atualizada no meu playbook` (história 67)
     - `Novo evento criado que exige resposta` (história 68)
     - `Lembrete antes do prazo de resposta vencer` (história 69)
     - *(Exclusivo Staff)* `Jogador respondeu ou justificou ausência em evento` (história 70)
     - *(Exclusivo Head Coach)* `Novo cadastro de staff aguardando aprovação` (história 71)
   - Nota sobre rede de segurança: `"Quando o Web Push não estiver disponível no seu aparelho, os avisos importantes serão enviados por e-mail."` (história 73).
5. **Cartão de Suporte e Canal com o Staff (História 78)**:
   - Bloco `"Não conseguiu responder a um evento ou precisa falar com o staff?"` com campo de mensagem curta / assunto e botão `"Enviar mensagem ao staff"`.
6. **Cartão de Sessão e Privacidade (Histórias 11, 12, 79)**:
   - Informação de sessão persistente (`"Você permanece conectado entre visitas neste aparelho"` — história 12).
   - Botão secundário `"Sair da conta"` (para uso em aparelho compartilhado — história 11).
   - Zona de perigo delimitada: botão destrutivo `"Apagar minha conta"` que abre diálogo de confirmação exigindo digitar `APAGAR` antes da exclusão definitiva (história 79).

### Desktop (`>= 1024px`) — Grade em 2 Colunas (6 + 6 colunas)
- **Coluna Esquerda**: Identidade, Meu Status do Elenco, Unidades e Posições (ou Subpapéis do Staff) e consulta somente leitura de companheiros.
- **Coluna Direita**: Preferências de Notificação (Web Push + E-mail), Canal de Contato com o Staff e Sessão / Exclusão de Conta.

---

## 3. Estados da Tela e dos Componentes

| Estado | Comportamento visual e acessível |
| :--- | :--- |
| **Carregando (`loading`)** | Skeleton para o cartão de identidade, chips de posição e chaves de notificação (`aria-busy="true"`). |
| **Vazio (`empty`)** | Quando um jogador recém-cadastrado ainda não selecionou posições: destaca o cartão de Unidades e Posições com borda de atenção (`--color-accent-new`) e mensagem `"Selecione pelo menos uma unidade e uma posição para personalizar seu playbook."` |
| **Erro (`error`)** | 1) Tentativa de salvar sem nenhuma posição selecionada: alerta `role="alert"` (`"Escolha ao menos uma posição antes de salvar."`).<br>2) Permissão de Web Push negada no navegador: exibe instrução passo a passo para reabilitar nas configurações do navegador e confirma que o fallback por e-mail está ativo. |
| **Sucesso (`default`)** | Banner de confirmação `"Suas unidades e posições foram atualizadas. O Playbook já reflete sua escolha."` anunciado via `aria-live="polite"`. |

---

## 4. Variação por Papel e Subpapel

- **Jogador**:
  - Visualiza seu próprio **status do elenco** em modo leitura (história 20).
  - Edita livremente suas **unidades** (`Ofensiva`, `Defesa` ou `Ambas`) e suas **posições** múltiplas (histórias 4, 5, 6).
  - Consulta a lista somente leitura de companheiros do time com posições, unidades e status do elenco (histórias 13, 14).
  - Configura as 3 preferências de notificação de jogador.
- **Staff (Coordenadores e Head Coach)**:
  - Visualiza seu papel `Staff` e seus **subpapéis** ativos (`Head Coach`, `Coordenador Ofensivo`, `Coordenador Defensivo`, `Coordenador de Special Teams`).
  - Configura também as notificações exclusivas de staff (respostas/justificativas de eventos e, para head coach, novos cadastros de staff pendentes — histórias 70, 71).

---

## 5. O que NÃO aparece para Jogador

1. **Controles para editar o próprio status do elenco** (o jogador vê seu status do elenco no perfil em modo somente leitura; apenas o staff pode alterá-lo na tela Elenco — histórias 15, 20).
2. **Chaves de notificação exclusivas do staff** (`"Receber push quando um jogador justifica ausência"` e `"Receber push quando um cadastro de staff aguarda aprovação"` — histórias 70, 71).
3. **Seletor administrativo de subpapéis do staff**.
