import { test, expect } from '@playwright/test';

const URL = 'https://infofinca.frcol.io/';
const EMAIL = 'ginasambony91@gmail.com';
const PASSWORD = 'infocasas';

// Utilidad para login condicional
async function ensureLoggedIn(page) {
  const loggedIn = await page.locator('//*[@id="__next"]/div/header/div[1]/div[1]/span').isVisible().catch(() => false);
  if (!loggedIn) {
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByRole('textbox', { name: 'Correo electrónico' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(EMAIL);
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Enviar' }).click();
  }
}
test.describe('Desactivar Inmueble', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
        await expect(page).toHaveTitle(/Finca ?Ra[ií]z/i);
  
});

test('Desactivar Inmueble', async ({ page, context }) => {
    test.setTimeout(180000); // 3 minutos
    await ensureLoggedIn(page);

  // Espera explícita para el ícono del usuario logueado
const userIcon = page.locator('.btn-user.btn-header-text .icon-user');

await expect(userIcon).toBeVisible({ timeout: 30000 });
await userIcon.click();

  // Esperar nueva pestaña
  const [page1] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Oficina Virtual' }).click(),
  ]);

  // Ir a administrar inmuebles
  await expect(page1.locator('#sidebar > nav > ul > span:nth-child(3) > li > a')).toBeVisible();
  await page1.locator('#sidebar > nav > ul > span:nth-child(3) > li > a').click({ timeout: 10000 });

  // Función para extraer inmuebles (opcional)
  async function extraerIdsInmuebles(page) {
    await page.waitForTimeout(2000);
    const filas = page.locator('table tbody tr');
    const total = await filas.count();
    for (let i = 0; i < total; i++) {
      const fila = filas.nth(i);
      const texto = await fila.textContent();
      console.log(texto);
    }
  }
  await extraerIdsInmuebles(page1); 
  const codigo = '192684491'; // Cambia este código al que necesites

  // Localiza la fila principal con el código
  const filaCodigo = page1.locator('table tbody tr').filter({ hasText: codigo });
  await filaCodigo.waitFor({ state: 'visible', timeout: 10000 });

  // Asegura visibilidad
  await filaCodigo.scrollIntoViewIfNeeded();

  // Localiza la siguiente fila (detalle)
  const filaDetalle = filaCodigo.locator('xpath=following-sibling::tr[1]');

  // Dentro de esa fila, localiza el botón 'Desactiva'
  const btnDesactivar = filaDetalle.locator('button:has-text("Desactivar")');
  await btnDesactivar.waitFor({ state: 'visible', timeout: 10000 });
  await btnDesactivar.click();
  
    // Confirmación de desactivación
    // Se habilita la confirmación para activar el inmueble
await expect(page1.getByRole('dialog')).toBeVisible({ timeout: 10000 });

const btnDesac = page1.getByRole('button', { name: 'Activar' });
await btnDesac.waitFor({ state: 'visible', timeout: 10000 });
await btnDesac.click();
})});
