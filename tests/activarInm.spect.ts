import { test, expect } from '@playwright/test';

const URL = 'https://infofinca.frcol.io/';
const EMAIL = 'ginasambony91@gmail.com';
const PASSWORD = 'infocasas';

// Utilidad para login condicional
async function ensureLoggedIn(page) {
  // Cambia el selector por uno que solo exista si ya estás logueado
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

test.describe('Activar Inmueble', () => {
  test('Activar Inmueble', async ({ page, context }) => {
    test.setTimeout(180000); // 3 minutos

    await page.goto(URL);
    await ensureLoggedIn(page);

    // Espera explícita para el ícono del usuario logueado
    const userIcon = page.locator('.btn-user.btn-header-text .icon-user');
    await expect(userIcon).toBeVisible({ timeout: 30000 });
    await userIcon.click();

    // Oficina Virtual (nueva pestaña)
    const [page1] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Oficina Virtual' }).click(),
    ]);

    await page1.waitForLoadState();

    // Clic en botón "Administrar inmuebles"
    await expect(page1.locator('#sidebar > nav > ul > span:nth-child(3) > li > a')).toBeVisible({ timeout: 10000 });
    await page1.locator('#sidebar > nav > ul > span:nth-child(3) > li > a').click();

    // Extraer IDs (si se desea usar esta función)
    const extraerIdsInmuebles = async (pagina) => {
      await pagina.waitForTimeout(2000);
      const filas = pagina.locator('table tbody tr');
      const total = await filas.count();
      for (let i = 0; i < total; i++) {
        const fila = filas.nth(i);
        const texto = await fila.textContent();
        console.log(texto);
      }
    };
   // Código del inmueble a activar
const codigoActivar = '192410056';
const filaCodigo = page1.locator('table tbody tr').filter({ hasText: codigoActivar });
await filaCodigo.waitFor({ state: 'visible', timeout: 10000 });
await filaCodigo.scrollIntoViewIfNeeded();

const contenido = await filaCodigo.textContent();
console.log('Contenido de la fila', { contenido });

// Fila siguiente (donde están los botones)
const filaAcciones = filaCodigo.locator('xpath=following-sibling::tr[1]');
await filaAcciones.waitFor({ state: 'visible', timeout: 10000 });
await filaAcciones.scrollIntoViewIfNeeded();

// DEBUG: muestra los botones que encuentra
const botones = await filaAcciones.locator('button').allTextContents();
console.log('Botones en la fila de acciones:', botones);

// Botón Activar
const btnActivar = filaAcciones.getByRole('button', { name: 'Activar' });
await btnActivar.waitFor({ state: 'visible', timeout: 10000 });
await btnActivar.click();

// Se habilita la confirmación para activar el inmueble
await expect(page1.getByRole('dialog')).toBeVisible({ timeout: 10000 });

const btnActiv = page1.getByRole('button', { name: 'Activar' });
await btnActiv.waitFor({ state: 'visible', timeout: 10000 });
await btnActiv.click();

})

});
