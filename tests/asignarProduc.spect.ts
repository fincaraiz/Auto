import { test, expect } from '@playwright/test';

const URL = 'https://www.fincaraiz.com.co/';
const EMAIL = 'soporteciudades.fincaraiz@gmail.com';
const PASSWORD = 'Finca2025';

test.describe('Asignar producto E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await expect(page).toHaveTitle(/Finca ?Ra[ií]z/i);
  });

  async function login(page) {
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByRole('textbox', { name: 'Correo electrónico' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(EMAIL);
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Enviar' }).click();
    // Espera a que el usuario esté logueado
    await expect(page.locator('span').filter({ hasText: 'SAC-TEST' }).first()).toBeVisible();
  }

  test('asignar producto', async ({ page, context }) => {
    // Login optimizado
    await login(page);

    //dar click al nombre de la inmobiliaria 
  
    await expect(page.locator('//*[@id="__next"]/div/header/div[1]/div[1]/span')).toBeVisible();
    await page.locator('//*[@id="__next"]/div/header/div[1]/div[1]/span').click();

    // Oficina Virtual (nueva pestaña)
    const [page1] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'Oficina Virtual' }).click(),
      ]);

    // Navegar al menú de productos
    await page1.locator('span:nth-child(3) > ._sidebar-item_1fqgk_180 > ._sidebar-link_1fqgk_204').click();

    // Asignar productos
    await page1.getByRole('button', { name: 'Asignar productos' }).first().click();
    // Selecciona el botón 'Asignar producto' debajo de 'Etiqueta personalizada'
    const etiquetaPersonalizada = page1.getByText('Etiqueta personalizada');
    const asignarProductoBtn = etiquetaPersonalizada.locator('xpath=following::button[contains(., "Asignar producto")][1]');
    await expect(asignarProductoBtn).toBeVisible();
    await asignarProductoBtn.click();

    // --- Agregar etiqueta ---
    const browser = page1.context().browser();
    if (browser) {
      const context2 = await browser.newContext();
      const page2 = await context2.newPage();
      await page1.getByRole('radio', { name: 'Negociable' }).check();
      await page1.getByRole('button', { name: 'Agregar etiqueta' }).click();
      await page1.getByRole('button', { name: 'Asignar productos' }).nth(1).click();
      await page1.locator('div').filter({ hasText: /^Destacado GoldCupos disponibles:9Asignar producto$/ }).getByRole('button').click();
      // ---------------------
      await context2.close();
      await browser.close();
    }
  });
});