# PWA com Web Push em vez de app nativo

A dor central é avisar o jogador de que o playbook mudou ou de que um evento precisa de resposta. Escolhemos PWA com Web Push (VAPID) em vez de app nativo porque dispensa loja, build e publicação, e cobre Android e desktop imediatamente. O custo aceito: no iOS o push exige o app instalado na tela inicial (iOS 16.4+), permissão disparada por gesto e não há push silencioso. Um wrapper nativo só entra se o uso real mostrar perda de notificações.
