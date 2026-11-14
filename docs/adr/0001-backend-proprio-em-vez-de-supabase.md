# Backend próprio em vez de Supabase

O app exige escrita autenticada, regras de visibilidade por unidade e envio de push — nada disso cabe num front estático. Escolhemos backend próprio (Node/Fastify + Postgres gerenciado no Neon, deploy no Railway) em vez de Supabase porque o modelo de autorização fica todo no nosso código, em vez de dividido entre políticas SQL e a aplicação. Considered options: Supabase (mais rápido de começar, preterido pela dispersão da autorização e pelo acoplamento ao provedor) e backend em VPS próprio (preterido pelo custo de operação).
