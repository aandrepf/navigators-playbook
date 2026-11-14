import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Avança o foco com Tab até `target` ficar focado. Falha se não chegar em
 * `maxPresses` teclas: o alvo precisa ser alcançável pela ordem natural de foco,
 * sem atalhos de mouse ou `focus()` programático.
 */
export async function tabUntilFocused(page: Page, target: Locator, maxPresses = 20): Promise<void> {
  for (let i = 0; i < maxPresses; i += 1) {
    if (await target.evaluate((el) => el === document.activeElement)) return
    await page.keyboard.press('Tab')
  }
  await expect(target, `alvo não alcançável com Tab em ${maxPresses} teclas`).toBeFocused()
}
