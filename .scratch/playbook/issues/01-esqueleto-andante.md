# 01: Esqueleto andante

**What to build:** Um usuário consegue se cadastrar com e-mail, confirmar por código, entrar e chegar a uma home autenticada — com o app instalável e as abas do MVP visíveis conforme o papel. É a primeira fatia que atravessa banco, API, UI, testes e deploy de uma vez.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Cadastro por e-mail com código de uso único, sem senha, e sessão persistente por cookie
- [ ] Home autenticada com estado vazio, navegação inferior no celular e lateral no desktop
- [ ] Manifesto PWA instalável com `display: standalone` e service worker mínimo
- [ ] Banco com migrações versionadas e o primeiro head coach semeado
- [ ] Testes nos dois seams: API via `app.inject` com Postgres efêmero e uma tela com MSW
- [ ] Deploy no Railway com Postgres gerenciado, variáveis de ambiente documentadas
- [ ] Datas e prazos exibidos no fuso `America/Sao_Paulo`
