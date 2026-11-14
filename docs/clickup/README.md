# Importação dos tickets no ClickUp

O arquivo `mvp-tickets.csv` contém os 21 tickets do MVP extraídos de
`.scratch/playbook/issues/`.

## Importar

1. No ClickUp, abra a List `Playbook do Time`.
2. Abra o menu da List e escolha **Import/Export → Import tasks**.
3. Selecione **CSV** e envie `docs/clickup/mvp-tickets.csv`.
4. Mapeie `Task Name` para o nome da tarefa e `Description` para a descrição.
5. Mapeie `Status`, `Priority` e os campos personalizados `Tipo`, `Agente`,
   `Worktree`, `Branch` e `Modelo`.
6. Mantenha `Blocked By` e `Source Issue` como campos de texto durante a
   importação.

O ClickUp não cria de forma confiável dependências entre tarefas a partir desta
coluna. Depois da importação, configure os bloqueios manualmente usando
**Relationships → Blocking** e procure o ticket pelo número.

Os valores `Backlog` e `Normal` são intencionais: o fluxo e a prioridade podem
ser refinados no ClickUp depois da importação.
