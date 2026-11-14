# Fluxo 2: Resposta a Evento com Justificativa (`docs/design/flows/resposta-evento-justificativa.md`)

## 1. Visão Geral

Cobre o ciclo completo de resposta do **jogador** a um **evento** — tanto a **presença** em um treino quanto a **marcação** de **disponibilidade** para um jogo — incluindo confirmação em 1 toque (`Vou`), recusa com **justificativa** obrigatória em duas camadas (escolha em lista rápida + complemento em texto livre), alteração da resposta enquanto o **prazo de resposta** não venceu, bloqueio automático após o prazo e sigilo absoluto da justificativa (visível apenas para o **staff**).

Histórias do spec atendidas: `45`, `46`, `47`, `48`, `49`, `50`, `51`, `52`, `53`, `54`, `55`, `57`, `58`, `59`, `68`, `69`, `70`, `78`.

---

## 2. Diagrama do Fluxo Passo a Passo

```text
[Gatilho: Push "Novo evento exige resposta" / Lembrete antes do prazo / Card na Home]
        │
        ▼
[Tela Home ou Tela Evento / Jogo]
   - Verifica se o prazo de resposta está aberto (now <= event.deadline)
        │
        ├──► Caso 1: PRAZO ENCERRADO (now > event.deadline)
        │       - Botões "Vou" e "Não vou" em estado disabled (aria-disabled="true")
        │       - Mensagem: "Prazo encerrado em [Data/Hora]. Somente o staff pode alterar."
        │       - Botão de saída: "Falar com o staff" (História 78)
        │
        └──► Caso 2: PRAZO ABERTO (now <= event.deadline)
                │
                ├──► Jogador toca em [✓ VOU]
                │       - Estado loading ("Confirmando...")
                │       - Salva resposta 'vou' (Presença em treino / Marcação disponível em jogo)
                │       - Exibe selo "✓ Confirmado (Vou) — você pode mudar até [Prazo]"
                │       - Dispara push para o staff da unidade (História 70)
                │
                └──► Jogador toca em [✕ NÃO VOU]
                        │
                        ▼
                [Gaveta / Painel Expandido de Justificativa Obrigatória]
                   1. Escolha rápida de motivo (chips de 44px de altura, seleção obrigatória):
                      - [ Trabalho / Escala ]
                      - [ Saúde / Lesão ]
                      - [ Estudo / Prova ]
                      - [ Transporte / Deslocamento ]
                      - [ Compromisso familiar ]
                      - [ Outro motivo ]
                   2. Campo de texto livre complementar (<textarea>):
                      - Placeholder: "Complemente com detalhes para o staff (ex.: plantão até 18h)"
                      - Obrigatório se o chip escolhido for "Outro motivo"; opcional nos demais
                   3. Aviso de privacidade:
                      "🔒 Visível apenas para o staff. Outros jogadores verão apenas 'Ausente'."
                        │
                        ▼
                [Jogador toca em "Confirmar ausência com justificativa"]
                   - Se motivo vazio: erro de validação (borda #FB7185 + foco no seletor)
                   - Se válido: salva 'nao_vou' + justificativa
                   - Atualiza UI para "✕ Ausente (Justificativa enviada ao staff)"
                   - Permite clicar em "Alterar resposta" enquanto o prazo não venceu (História 50)
```

---

## 3. Pós-Evento: Presença Real vs. Resposta Prévia (Exclusivo Treino)

1. **Durante ou após o treino**, o **staff** abre a tela **Evento** e ativa o modo `"Registrar presença real"` (história 55).
2. A lista mostra o que cada jogador havia respondido (`Vou`, `Não vou` com justificativa, ou `Sem resposta`) ao lado do seletor de **comparecimento real** (`Presente` | `Ausente`).
3. O staff marca quem efetivamente compareceu em campo.
4. Para o **jogador**, a tela do evento passa a exibir o registro oficial: `"Presença real registrada pelo staff: Presente"` (ou `"Ausente"` — história 57), alimentando a **taxa de comparecimento** ao longo do tempo (história 56).

---

## 4. Regras de Privacidade e Estados dos Componentes

- **Proteção de dados sensíveis (História 54)**: jogadores frequentemente informam questões médicas, financeiras ou familiares na justificativa. A interface do jogador nunca renderiza o campo de justificativa de terceiros, exibindo apenas o estado binário `Confirmado` ou `Ausente`.
- **Distinção entre Disponibilidade de Jogo e Status do Elenco (História 19)**: quando o jogador responde `Não vou` em um evento do tipo **jogo** (na tela **Jogo**), sua **marcação** define sua **disponibilidade** apenas para aquele confronto; seu **status do elenco** cadastral (`disponivel`, `indisponivel`, `lesionado`, `reformado`) permanece inalterado a menos que o staff o edite na tela **Elenco**.
