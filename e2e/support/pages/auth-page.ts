import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Tela de entrada e cadastro (`/login`). Seleciona por papel e rótulo, como o
 * usuário enxerga. Os passos seguem a ordem do fluxo real: welcome → e-mail →
 * código → papel → posições (jogador) ou pendência (staff).
 */
export class AuthPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 })
  }

  async goto(): Promise<void> {
    await this.page.goto('/login')
    await expect(this.page.getByRole('button', { name: 'Entrar com código por e-mail' })).toBeVisible()
  }

  /**
   * Botão de login Google. O nome acessível é "Entrar com Google" (aria-label);
   * o texto visível é "com o Google" ao lado do ícone colorido. Aceitamos os dois
   * para não depender de qual deles o accessible name expõe.
   */
  googleButton(): Locator {
    return this.page.getByRole('button', { name: /entrar com google|com o google/i })
  }

  emailLoginButton(): Locator {
    return this.page.getByRole('button', { name: 'Entrar com código por e-mail' })
  }

  async startEmailLogin(): Promise<void> {
    await this.emailLoginButton().click()
    await expect(this.page.getByRole('heading', { name: 'Criar conta ou entrar' })).toBeVisible()
  }

  /**
   * Preenche nome e e-mail e pede o código. O time não é digitado: a tela
   * mostra o Time (Navigators, somente leitura) e o Código do time já preenchido com
   * NAVS-2026, que pode ser editado.
   */
  async requestCode(input: { email: string; name?: string }): Promise<void> {
    await this.page.getByLabel(/nome completo/i).fill(input.name ?? 'Conta E2E')
    await this.page.getByLabel(/^e-mail/i).fill(input.email)
    await this.page.getByRole('button', { name: 'Receber código de 6 dígitos' }).click()
    await expect(this.page.getByRole('heading', { name: 'Verifique seu e-mail' })).toBeVisible()
  }

  /** Digita o código recebido e avança para a escolha de papel. */
  async enterCode(code: string): Promise<void> {
    await this.page.getByLabel(/código de verificação/i).fill(code)
    await this.page.getByRole('button', { name: 'Continuar' }).click()
    await expect(this.page.getByRole('heading', { name: 'Como você participa do time?' })).toBeVisible()
  }

  async choosePapel(papel: 'JOGADOR' | 'STAFF'): Promise<void> {
    // Caixa do rótulo não é regra de negócio ("JOGADOR" antigo, "Jogador" atual).
    await this.page.getByRole('button', { name: new RegExp(`^${papel}\\b`, 'i') }).click()
  }

  /** Marca posições e envia o cadastro de jogador. */
  async submitPlayer(input: { positions: string[] }): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Suas posições' })).toBeVisible()
    for (const position of input.positions) {
      await this.page.getByRole('button', { name: position, exact: true }).click()
    }
    await this.createAccountButton().click()
  }

  createAccountButton(): Locator {
    return this.page.getByRole('button', { name: /^Criar conta$/ })
  }

  /** Staff é criado diretamente como pendente após escolher o papel. */
  async submitStaff(): Promise<void> {
    await expect(this.pendingHeading()).toBeVisible()
  }

  pendingHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Cadastro pendente' })
  }

  alert(): Locator {
    return this.page.getByRole('alert')
  }
}
