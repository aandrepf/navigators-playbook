export function AuthMain({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <main id="conteudo-principal" className="auth-layout" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
