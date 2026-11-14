# Fluxo 6: Instalação do PWA na Tela Inicial e Ativação de Web Push (`docs/design/flows/instalacao-pwa.md`)

## 1. Visão Geral

Para que o **jogador** e o **staff** recebam avisos em tempo real quando uma **jogada** for atualizada ou um **evento** exigir resposta (ADR-0002), o app utiliza **Web Push (VAPID)** com **e-mail** como rede de segurança. No iOS (16.4+), o Web Push exige que o PWA esteja instalado na tela inicial (`display: standalone`) e que o pedido de permissão seja disparado por um gesto explícito do usuário. A **Home** apresenta o convite de instalação **uma única vez**, sem insistir, mantendo também o acesso permanente às instruções na tela **Perfil**.

Histórias do spec atendidas: `67`, `68`, `69`, `70`, `71`, `72`, `73`, `74`.

---

## 2. Diagrama do Fluxo Passo a Passo

```text
[Usuário autenticado entra na Home pela primeira vez no celular/desktop]
        │
        ▼
[Detecção de Ambiente no Cliente]
   ├─ Já está rodando como PWA instalado (display-mode: standalone)?
   │     │
   │     ├──► SIM: Exibe cartão discreto "Ativar avisos em tempo real" com botão de gesto:
   │     │         [ 🔔 Ativar notificações push neste aparelho ]
   │     │               │
   │     │               ▼
   │     │         (Dispara Notification.requestPermission() por gesto do usuário -> Registra VAPID push_subscription)
   │     │
   │     └──► NÃO (Aberto em aba normal do navegador — ex.: iOS Safari ou Chrome Android):
   │               │
   │               ▼
   │         [Exibe Banner de Convite na Home UMA ÚNICA VEZ (História 74 / Notas do Spec)]
   │            - Título: "Instale o Playbook na tela inicial para receber notificações push"
   │            - Explicação curta:
   │              "No celular (especialmente iPhone/iOS), os avisos de nova jogada e prazo de treino
   │               só chegam por push quando o app está instalado na tela inicial."
   │            - Passos visuais diretos:
   │              • iOS Safari: Toque em [Compartilhar ↑] na barra do navegador -> [Adicionar à Tela de Início (+)]
   │              • Android / Chrome: Toque em [Instalar aplicativo] (dispara beforeinstallprompt)
   │            - Ações (min-height: 44px):
   │              [ Ver passo a passo / Instalar ]   [ Entendi, não mostrar novamente ]
   │               │
   │               ▼
   │         [Ao dispensar o banner]
   │            - Grava que o convite já foi apresentado (não volta a insistir na Home)
   │            - O e-mail verificado continua cobrindo todos os avisos automaticamente (História 73)
   │            - Se o usuário quiser instalar ou ativar push depois, encontra o bloco completo na aba [Perfil]
```

---

## 3. Regras de Experiência e Acessibilidade (ADR-0002)

1. **Zero insistência na Home**: conforme especificado nas notas adicionais do spec (*"A Home deve apresentar esse convite uma vez, sem insistir, e o e-mail cobre quem não instalar"*), uma vez fechado pelo botão `"Entendi, não mostrar novamente"`, o banner nunca bloqueia a Home novamente.
2. **Gesto explícito obrigatório**: a API de Web Push nunca é chamada automaticamente no `onload` da página; é sempre acionada pelo toque no botão `"Ativar notificações push neste aparelho"` (`min-height: 44px`).
3. **Transparência sobre o Fallback por E-mail (História 73)**: tanto no banner da Home quanto na tela **Perfil**, o usuário vê claramente que, enquanto o Web Push não estiver ativo no aparelho, ele receberá os avisos de eventos, prazos e atualizações por e-mail.
