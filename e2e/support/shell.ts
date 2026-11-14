import type { Page } from '@playwright/test'

/**
 * Navegação principal visível para o viewport atual. No celular é a barra
 * inferior; no desktop, a lateral. Elementos ocultos saem da árvore de
 * acessibilidade, então o locator devolve só a navegação que o usuário vê.
 */
export function primaryNav(page: Page) {
  return page.getByRole('navigation', { name: /Navegação principal/ })
}

/** Link da navegação principal pelo nome visível (ex.: 'Playbook'). */
export function navLink(page: Page, name: string) {
  return primaryNav(page).getByRole('link', { name, exact: true })
}
