import { expect, type Locator, type Page } from '@playwright/test'
import { TEAM_CODE } from '../constants.mjs'

export type Unit = 'Ofensiva' | 'Defesa' | 'Special teams'

/**
 * Tela de entrada e cadastro (`/login`). Seleciona por papel e rótulo, como o
 * usuário enxerga. Os passos seguem a ordem do fluxo real: welcome → e-mail →
 * código → papel → unidades/posições (jogador) ou subpapel (staff).
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

  googleButton(): Locator {
    return this.page.getByRole('button', { name: 'Continuar com Google' })
  }

  emailLoginButton(): Locator {
    return this.page.getByRole('button', { name: 'Entrar com código por e-mail' })
  }

  async startEmailLogin(): Promise<void> {
    await this.emailLoginButton().click()
    await expect(this.page.getByRole('heading', { name: 'Criar conta ou entrar' })).toBeVisible()
  }

  /** Preenche código do time, nome e e-mail e pede o código. */
  async requestCode(input: { email: string; name?: string; teamCode?: string }): Promise<void> {
    await this.page.getByLabel(/código do time/i).fill(input.teamCode ?? TEAM_CODE)
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
    await this.page.getByRole('button', { name: new RegExp(`^${papel}\\b`) }).click()
  }

  /** Marca unidades e posições e envia o cadastro de jogador. */
  async submitPlayer(input: { units: Unit[]; positions: string[] }): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Unidades e Posições' })).toBeVisible()
    for (const unit of input.units) {
      await this.page.getByRole('button', { name: unit, exact: true }).click()
    }
    for (const position of input.positions) {
      await this.page.getByRole('group', { name: 'Posições' }).getByRole('button', { name: position, exact: true }).click()
    }
    await this.createAccountButton().click()
  }

  createAccountButton(): Locator {
    return this.page.getByRole('button', { name: /^Criar conta$/ })
  }

  /** Marca o subpapel principal do staff e envia o cadastro. */
  async submitStaff(subRole: 'Coordenador Ofensivo' | 'Coordenador Defensivo'): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Subpapel do Staff' })).toBeVisible()
    await this.page.getByRole('radio', { name: new RegExp(subRole) }).check()
    await this.createAccountButton().click()
  }

  pendingHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Cadastro pendente' })
  }

  alert(): Locator {
    return this.page.getByRole('alert')
  }
}
