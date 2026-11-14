# Sincronização Orca → ClickUp

O sincronizador lê o estado do run do Orca e atualiza os cards correspondentes
na API do ClickUp. Ele não cria cards automaticamente: o CSV é importado uma
vez e o mapa dos IDs é preenchido depois.

## Configuração

1. Copie o mapa de exemplo:

   ```bash
   cp config/clickup-tasks.example.json config/clickup-tasks.json
   ```

2. Substitua cada `REPLACE_WITH_CLICKUP_TASK_ID` pelo ID real do card.
3. Exporte as variáveis na sessão do terminal:

   ```bash
   export CLICKUP_API_TOKEN='seu-token'
   export CLICKUP_LIST_ID='id-da-list'
   export ORCA_RUN_ID='run_b230e13ad6ab'
   ```

O token nunca deve ser salvo no Git. O `CLICKUP_LIST_ID` é validado como parte
da configuração operacional, embora a atualização de cards use o ID individual
de cada tarefa.

## Executar

Simular sem alterar o ClickUp:

```bash
npm run sync:clickup -- --dry-run
```

Sincronizar uma vez:

```bash
npm run sync:clickup
```

Sincronizar continuamente, a cada cinco minutos:

```bash
CLICKUP_SYNC_INTERVAL=300 npm run sync:clickup
```

## Mapeamento de status

| Orca | ClickUp |
|---|---|
| `pending` | `Backlog` |
| `ready` | `Pronto` |
| `dispatched` | `Em andamento` |
| `blocked` | `Bloqueado` |
| `completed` | `Concluído` |
| `failed` | `Revisão` |

O script atualiza o status apenas quando ele muda. Ao receber um relatório do
worker, publica o texto como comentário uma única vez. O estado local fica em
`.clickup-sync-state.json`, que é ignorado pelo Git.

## Limites atuais

- O sincronizador não cria cards nem configura dependências automaticamente.
- O ClickUp precisa ter os status com estes nomes exatos.
- Para execução contínua, mantenha o processo rodando ou agende o comando com
  `launchd`, cron ou CI.
