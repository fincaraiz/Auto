import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const URL = 'https://www.fincaraiz.com.co/';
const EMAIL = 'soporteciudades.fincaraiz@gmail.com';
const PASSWORD = 'Finca2025';

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

// Función para incrementar un campo por índice
async function incrementarPorIndice(page, indice, veces = 1) {
  const plusButtons = page.locator('[data-testid="counter-inc"]');
  for (let i = 0; i < veces; i++) {
    await plusButtons.nth(indice).click();
  }
}

test.describe('FincaRaiz E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await expect(page).toHaveTitle(/Finca ?Ra[ií]z/i);
  });

  test('publicar inmueble', async ({ page, context }) => {
    test.setTimeout(120000); // 2 minutos
    // Login solo si es necesario
    await ensureLoggedIn(page);

    // Hacer clic en el localizador solicitado después del login
    await expect(page.locator('//*[@id="__next"]/div/header/div[1]/div[1]/span')).toBeVisible();
    await page.locator('//*[@id="__next"]/div/header/div[1]/div[1]/span').click();

    // Oficina Virtual (nueva pestaña)
    const [page1] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Oficina Virtual' }).click(),
    ]);

    // Hacer clic en el elemento del sidebar solicitado
    await page1.locator('span:nth-child(2) > ._sidebar-item_9sv68_189').click();

    // Espera a que cargue el formulario
    await expect(page1.getByRole('textbox', { name: 'Dirección / punto referencia*' })).toBeVisible();

    // Completa el formulario
    await page1.getByRole('textbox', { name: 'Dirección / punto referencia*' }).fill('carrera 92#152a -50');
    await expect(page1.getByText('Carrera 92 #152a-50, Bogota,')).toBeVisible();
    await page1.getByText('Carrera 92 #152a-50, Bogota,').click();
    await page1.getByRole('textbox', { name: 'Seleccionar ubicación' }).fill('pinar de suba');
    

    // --- Selección de Tipo de oferta ---
    await page1.getByRole('button', { name: 'Tipo de oferta* Seleccionar' }).click();
    await expect(page1.getByTestId('downshift-2-item-1')).toBeVisible();
    await page1.getByTestId('downshift-2-item-1').click();

    // --- Selección de Tipo de inmueble ---
    await page1.getByRole('button', { name: 'Tipo de inmueble* Seleccionar' }).click();
    await expect(page1.getByText('Apartamento')).toBeVisible();
    await page1.getByText('Apartamento').click();

    // --- Llenar el campo de Precio ---
    const precioInput = page1.getByRole('textbox', { name: 'Precio*' });
    await expect(precioInput).toBeEnabled();
    await precioInput.click({ clickCount: 3 });
    await precioInput.fill('');
    await precioInput.type('1500000');
    await expect(precioInput).toHaveValue(/\$[\s\u00A0]?1\.500\.000/);

    // --- Selección de Estrato ---
    const estratoBtn = page1.getByRole('button', { name: 'Estrato* Seleccionar' });
    await expect(estratoBtn).toBeVisible();
    await estratoBtn.click();
    // Selecciona la opción '3' por texto visible
    const estratoOpcion = page1.getByRole('option', { name: /^3$/ });
    await expect(estratoOpcion).toBeVisible();
    await estratoOpcion.click();

    // --- Selección de Antigüedad del inmueble ---
    const antiguedadBtn = page1.getByRole('button', { name: 'Antigüedad del inmueble' });
    await expect(antiguedadBtn).toBeVisible();
    await antiguedadBtn.click();
    // Selecciona la opción '9 a 15' por texto visible
    const antiguedadOpcion = page1.getByRole('option', { name: '9 a 15 años' });
    await expect(antiguedadOpcion).toBeVisible();
    await antiguedadOpcion.click();

    // --- Área construída ---
    const areaInput = page1.locator('//*[@id="area"]');
    await expect(areaInput).toBeVisible();
    await areaInput.fill('57');
    await expect(areaInput).toHaveValue('57');

    // --- Habitaciones ---
    // Cambia el número 3 para seleccionar la cantidad de habitaciones deseada
    await incrementarPorIndice(page1, 0, 3); // 3 habitaciones

    // --- Baños ---
    // Cambia el número 2 para seleccionar la cantidad de baños deseada
    await incrementarPorIndice(page1, 1, 2); // 2 baños

    // --- Parqueaderos ---
    // Cambia el número 1 para seleccionar la cantidad de parqueaderos deseada
    await incrementarPorIndice(page1, 2, 1); // 1 parqueadero

    // --- Piso ---
    await page1.getByRole('button', { name: /N° de Piso/ }).click();
    await page1.getByRole('option', { name: /^2$/ }).click();

    // --- Descripción ---
    const descripcionTextarea = page1.locator('textarea#undefined-field');
    await expect(descripcionTextarea).toBeVisible();
    await descripcionTextarea.click();
    await descripcionTextarea.fill('Ejemplo automatización');
    const codeBrokerInput = page1.locator('input#undefined-field');
    await expect(codeBrokerInput).toBeVisible();
    await codeBrokerInput.click();
    await codeBrokerInput.fill('Ejemplo automatización');

    // --- Características adicionales ---
    await expect(page1.getByText('Loft')).toBeVisible();
    await page1.getByText('Loft').click();
    await expect(page1.getByText('Cocina Integral')).toBeVisible();
    await page1.getByText('Cocina Integral').click();
    await expect(page1.getByText('Cocina tipo Americano')).toBeVisible();
    await page1.getByText('Cocina tipo Americano').click();
    await expect(page1.getByText('Baño Auxiliar')).toBeVisible();
    await page1.getByText('Baño Auxiliar').click();
    await expect(page1.getByText('Instalación de gas')).toBeVisible();
    await page1.getByText('Instalación de gas').click();
    await expect(page1.getByText('Citófono')).toBeVisible();
    await page1.getByText('Citófono').click();
    await expect(page1.getByRole('checkbox', { name: 'Salón Comunal' })).toBeVisible();
    await page1.getByRole('checkbox', { name: 'Salón Comunal' }).check();
    await expect(page1.getByText('Zonas Verdes')).toBeVisible();
    await page1.getByText('Zonas Verdes').click();
    await expect(page1.locator('div').filter({ hasText: /^Zona Infantil$/ }).first()).toBeVisible();
    await page1.locator('div').filter({ hasText: /^Zona Infantil$/ }).first().click();
    await expect(page1.getByText('En conjunto cerrado')).toBeVisible();
    await page1.getByText('En conjunto cerrado').click();
    await expect(page1.locator('div').filter({ hasText: /^Jardín$/ }).first()).toBeVisible();
    await page1.locator('div').filter({ hasText: /^Jardín$/ }).first().click();
    await expect(page1.getByText('Parqueadero Visitantes')).toBeVisible();
    await page1.getByText('Parqueadero Visitantes').click();
    await expect(page1.getByText('Portería / Recepción')).toBeVisible();
    await page1.getByText('Portería / Recepción').click();
    await expect(page1.locator('div').filter({ hasText: /^Garaje\(s\)$/ }).first()).toBeVisible();
    await page1.locator('div').filter({ hasText: /^Garaje\(s\)$/ }).first().click();
    await expect(page1.getByText('Garaje(s)')).toBeVisible();
    await page1.getByText('Garaje(s)').click();
    await expect(page1.getByText('Colegios / Universidades')).toBeVisible();
    await page1.getByText('Colegios / Universidades').click();
    await expect(page1.getByText('Parques cercanos')).toBeVisible();
    await page1.getByText('Parques cercanos').click();
    await expect(page1.getByRole('checkbox', { name: 'Sobre vía principal' })).toBeVisible();
    await page1.getByRole('checkbox', { name: 'Sobre vía principal' }).check();
    await expect(page1.getByRole('checkbox', { name: 'Zona Residencial' })).toBeVisible();
    await page1.getByRole('checkbox', { name: 'Zona Residencial' }).check();
    await expect(page1.getByText('Trans. Público cercano')).toBeVisible();
    await page1.getByText('Trans. Público cercano').click();

    // --- Selección de Agente ---
    const agenteBtn = page1.getByRole('button', { name: 'Agente 1* Seleccionar' });
    await expect(agenteBtn).toBeVisible();
    await agenteBtn.click();
    const agenteOpcion = page1.getByText(/agente1@fincaraiz.com.co$/);
    await expect(agenteOpcion).toBeVisible();
    await agenteOpcion.click();

    
    // URLs de tus imágenes en GitHub (raw)
    const imagenesGitHub = [
      'https://raw.githubusercontent.com/fincaraiz/Auto/main/imagenes/avivir_1.jpg',
      'https://raw.githubusercontent.com/fincaraiz/Auto/main/imagenes/recanto-render-noviembre-2020_1.jpg',
      'https://raw.githubusercontent.com/fincaraiz/Auto/main/imagenes/render-montecielo2.jpg'
    ];

    // Carpeta temporal local
    const carpetaTemporal = path.join(__dirname, 'imagenes_temp');
    if (!fs.existsSync(carpetaTemporal)) fs.mkdirSync(carpetaTemporal);

    // Descarga las imágenes antes del test
    for (const url of imagenesGitHub) {
      const nombreArchivo = path.basename(url);
      const res = await fetch(url);
      const buffer = await res.buffer();
      fs.writeFileSync(path.join(carpetaTemporal, nombreArchivo), buffer);
    }
    const imageFiles = fs.readdirSync(carpetaTemporal)
      .filter(file => /\.(jpg|jpeg)$/i.test(file))
      .map(file => path.join(carpetaTemporal, file));

    // Sube las imágenes (ajusta el selector si es necesario)
    await page1.setInputFiles('input[type="file"]', imageFiles);

    // Guardar borrador y confirmar
    const guardarBtn = page1.getByRole('button', { name: 'Publicar' });
    await expect(guardarBtn).toBeVisible();
    await guardarBtn.click();
    await page1.waitForTimeout(2500);
    // Espera a que el botón esté visible y habilitado usando el id proporcionado
    const confirmarBtn = page1.locator('//*[@id="root"]/main/div[2]/div[1]/div/div/form/div[10]/footer/button[2]');
    await expect(confirmarBtn).toBeVisible({ timeout: 40000 });
    await expect(confirmarBtn).toBeEnabled();
    await confirmarBtn.click();
    // Clic adicional requerido
    await page1.locator('xpath=/html/body/div[10]/div[3]/div/div[2]/button[2]').click();

    // Validación final (ajusta según el mensaje o estado esperado)
    
  });

 });
