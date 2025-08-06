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

test.describe('Asignar productos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await expect(page).toHaveTitle(/Finca ?Ra[ií]z/i);
  });

  test('Asignar Producto', async ({ page, context }) => {
    test.setTimeout(180000); // 3 minutos
    // Login solo si es necesario
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

    //Clic en el botón de administrar inmuebles
    await expect(page1.locator('#sidebar > nav > ul > span:nth-child(3) > li > a')).toBeVisible();
    await page1.locator('#sidebar > nav > ul > span:nth-child(3) > li > a').click();({timeout: 10000 });

    //Extraer el id de los inmuebles
   async function extraerIdsInmuebles(page1) {
  await page1.waitForTimeout(2000);
  const filas = page1.locator('table tbody tr');
  const total = await filas.count();

  for (let i = 0; i < total; i++) {
    const fila = filas.nth(i);
    const texto = await fila.textContent();
    console.log(texto);
  }
}


const codigo = '10861001';

// Localiza la fila principal con el código
const filaCodigo = page1.locator('table tbody tr').filter({ hasText: codigo });
await filaCodigo.waitFor({ state: 'visible', timeout: 10000 });

// Asegura visibilidad y expande si es necesario
await filaCodigo.scrollIntoViewIfNeeded();

// Localiza la siguiente fila (la fila detalle que contiene los botones)
const filaDetalle = filaCodigo.locator('xpath=following-sibling::tr[1]');

// Dentro de esa fila, localiza el botón 'Asignar productos'
const botonAsignar = filaDetalle.locator('button:has-text("Asignar productos")');
await botonAsignar.waitFor({ state: 'visible', timeout: 10000 });
await botonAsignar.click();

// Espera a que el modal esté visible
await expect(page1.getByRole('dialog')).toBeVisible({ timeout: 10000 });

// Localiza solo la card de "Etiqueta Personalizada"
const card = page1.locator('div._product-card_1giun_122', {
  has: page1.locator('text=Etiqueta Personalizada')
});

// Verifica que la card esté visible
await expect(card).toBeVisible({ timeout: 5000 });

// Localiza el botón dentro de esa card
const asignarBtn = card.getByRole('button', { name: 'Asignar producto' });

// Asegura visibilidad e interactividad
await expect(asignarBtn).toBeVisible();
await expect(asignarBtn).toBeEnabled();

// Clic real — forzado si es necesario
await asignarBtn.click({ force: true });

// Espera a que el nuevo dialog esté visible
const nuevoDialog = page1.getByRole('dialog').last(); 
await expect(nuevoDialog).toBeVisible({ timeout: 5000 });

// Localiza el texto 'Remodelado' dentro del dialog
const Etiquetas = nuevoDialog.getByText('Remodelado', { exact: true });

// Espera y haz clic (si se requiere interacción)
await expect(Etiquetas).toBeVisible();
await Etiquetas.click(); // opcional si se debe hacer clic

// Clic en el botón "Agregar etiqueta"
const agregarEtiquetaBtn = nuevoDialog.getByRole('button', { name: 'Agregar etiqueta' });
await expect(agregarEtiquetaBtn).toBeVisible();
await agregarEtiquetaBtn.click();
await page1.waitForTimeout(2000); // Espera 2 segundos para que se procese la acción

//Asginar destacado Gold

await extraerIdsInmuebles(page1);

const codigoGold = '192684490';

// Localiza la fila principal con el código Gold
const filaCodigoGold = page1.locator('table tbody tr').filter({ hasText: codigoGold });
await filaCodigoGold.waitFor({ state: 'visible', timeout: 10000 });

// Asegura visibilidad y expande si es necesario
await filaCodigoGold.scrollIntoViewIfNeeded();

// Localiza la fila detalle
const filaDetalleGold = filaCodigoGold.locator('xpath=following-sibling::tr[1]');

// Dentro de esa fila, localiza el botón 'Asignar productos'
const botonAsignarGold = filaDetalleGold.locator('button:has-text("Asignar productos")');
await botonAsignarGold.waitFor({ state: 'visible', timeout: 10000 });
await botonAsignarGold.click();

// Espera a que el modal esté visible
await expect(page1.getByRole('dialog')).toBeVisible({ timeout: 10000 });

// Ahora sí puedes localizar la card "Destacado Gold"
const goldCard = page1.locator('div._product-card_1giun_122', {
  has: page1.locator('text=Destacado Gold')
});
await expect(goldCard).toBeVisible({ timeout: 5000 });

// Localiza el botón dentro de esa card
const btnAsignarProductoFinal = goldCard.getByRole('button', { name: 'Asignar producto', exact: true });

await expect(btnAsignarProductoFinal).toBeVisible({ timeout: 10000 });
await btnAsignarProductoFinal.click();

// Asignar Bump
await extraerIdsInmuebles(page1);
const codigoBump = '191470544';

// Localiza la fila que contiene el código
const filaCodigoBump = page1.locator('table tbody tr').filter({ hasText: codigoBump });
await filaCodigoBump.scrollIntoViewIfNeeded(); // opcional pero útil

// Localiza la siguiente fila (usualmente el detalle expandido)
const filaDetalleBump = filaCodigoBump.locator('xpath=following-sibling::tr[1]');
await expect(filaDetalleBump).toBeVisible({ timeout: 10000 });

const botonAsignarBump = filaDetalleBump.locator('button:has-text("Asignar productos")');
await expect(botonAsignarBump).toBeVisible({ timeout: 10000 });
await botonAsignarBump.click();

// Espera a que el modal esté visible
await expect(page1.getByRole('dialog')).toBeVisible({ timeout: 10000 });

// Ahora sí puedes localizar la card "Bump"
const bumpCard = page1.locator('div._product-card_1giun_122', {
  has: page1.getByText('Bump 7 días', { exact: true })
});

await expect(bumpCard).toBeVisible({ timeout: 5000 });

// Localiza el botón dentro de esa card
const btnAsignarProductoBump = bumpCard.getByRole('button', { name: 'Asignar producto', exact: true });
await expect(btnAsignarProductoBump).toBeVisible({ timeout: 10000 });
await btnAsignarProductoBump.click();

//Asginar destacado Silver

await extraerIdsInmuebles(page1);

const codigoSilver = '10479095';

// Localiza la fila que contiene el código Silver
const filaSilver = page1.locator('table tbody tr').filter({ hasText: codigoSilver});
await filaSilver.waitFor({ state: 'visible', timeout: 10000 });

const contenido = await filaSilver.textContent();
console.log('Contenido de la fila encontrada:', contenido);

// Asegura visibilidad y expande si es necesario
await filaSilver.scrollIntoViewIfNeeded();

// Luego localiza el botón "Asignar productos" dentro de esa fila
const filaPrincipal = page1.locator('tr', { hasText: codigoSilver });
await filaPrincipal.waitFor({ state: 'visible', timeout: 5000 });

// Paso 2: Encuentra la siguiente fila (hermano siguiente)
const filaSiguiente = filaPrincipal.locator('xpath=following-sibling::tr[1]');
await filaSiguiente.waitFor({ state: 'visible', timeout: 5000 });

// Paso 3: Dentro de esa fila, busca el botón "Asignar productos"
const btnAsignar = filaSiguiente.locator('button:has-text("Asignar productos")');
await btnAsignar.waitFor({ state: 'visible', timeout: 5000 });

// Paso 4: Forzar clic (opcional si hay overlay o animación)
await btnAsignar.click({ force: true });

// Espera a que el modal esté visible
await expect(page1.getByRole('dialog')).toBeVisible({ timeout: 10000 });

// Localiza la card específica
const silverCard = page1.locator('div._product-card_1giun_122:has-text("Destacado Silver")');

// Paso 2: Localiza el botón dentro de esa card
const btnAsign = silverCard.getByRole('button', { name: 'Asignar producto', exact: true });

// Asegura que el botón esté visible y habilitado
await btnAsign.waitFor({ state: 'visible', timeout: 10000 });
await expect(btnAsign).toBeVisible();
await expect(btnAsign).toBeEnabled();

// Asegura que esté dentro del viewport
await btnAsign.scrollIntoViewIfNeeded();
// Revisa si lo detecta
console.log('Encontró botón:', await btnAsign.count());

// Intenta clic normal, luego clic forzado si falla
await expect(btnAsign).toBeVisible({ timeout: 5000 });
await expect(btnAsign).toBeEnabled({ timeout: 5000 });
await btnAsign.click();

if (await btnAsign.count() === 0) {
  throw new Error('No se encontró el botón "Asignar producto" dentro de la card Silver');
}
await btnAsign.scrollIntoViewIfNeeded();
await page1.waitForTimeout(300);
await btnAsign.evaluate((btn: HTMLElement) => btn.click());

//cierra la pagina de publicación
await page1.close();

});
 }); 

