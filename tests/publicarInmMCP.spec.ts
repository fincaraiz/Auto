// Test automatizado MCP para publicación de inmueble en Finca Raíz
import { test, expect } from '@playwright/test';

// Ajusta la URL y los datos según tu entorno y credenciales

test('Flujo MCP publicación inmueble Finca Raíz', async ({ page }) => {
  // 1. Ir a la página principal
  await page.goto('https://www.fincaraiz.com.co/');

  // 2. Ir a Oficina Virtual
  await page.click('text=Oficina Virtual');
  await page.evaluate(() => {
    window.location.href = 'https://newov.fincaraiz.com.co/inmobiliarias/dashboard';
  });

  // 3. Ir a la sección de publicación
  await page.click('a[href="/inmobiliarias/publicar"]');

  // 4. Llenar dirección principal
  await page.fill('input[placeholder="Ej: Carulla 147 Bogotá"]', 'carrera 92#152a -50');
  await page.click('li[role="option"]');

  // 5. Llenar barrio/ubicación secundaria
  await page.fill('#downshift-1-input', 'Pinar de suba');
  await page.click('li[role="option"]:has-text("Pinar de Suba")');

  // 6. Seleccionar tipo de oferta y tipo de inmueble
  await page.click('#downshift-2-toggle-button');
  await page.click('li[role="option"]:has-text("Arriendo")');
  await page.click('#downshift-3-toggle-button');
  await page.click('li[role="option"]:has-text("Apartamento")');

  // 7. Llenar precio
  await page.fill('#Precio-field', '1500000');

  // 8. Seleccionar estrato
  await page.click('#downshift-217-toggle-button');
  await page.click('li[role="option"]:has-text("3")');

  // 9. Seleccionar antigüedad
  await page.click('#downshift-218-toggle-button');
  await page.click('li[role="option"]:has-text("9 a 15 años")');

  // 10. Área construída
  await page.fill('#area', '57');

  // 11. Ajustar contadores de habitaciones, baños, parqueaderos
  // Habitaciones a 3
  for (let i = 0; i < 3; i++) await page.click('div:has-text("N° de Habitaciones") ~ div button:has-text("-")');
  // Baños a 2
  for (let i = 0; i < 2; i++) await page.click('div:has-text("N° de Baños") ~ div button:has-text("+")');
  // Parqueaderos a 1
  await page.click('div:has-text("N° de Parqueaderos") ~ div button:has-text("+")');
  // Piso 2
  await page.click('label:has-text("2")');

  // 12. Descripción
  await page.fill('textarea[aria-label*="Describe lo que necesitas explicar"],textarea[placeholder*="Describe lo que necesitas explicar"]', 'Ejemplo automatización');

  // 13. Seleccionar checkboxes de características interiores
  await page.click('label:has-text("Loft")');
  await page.click('label:has-text("Balcón")');
  await page.click('label:has-text("Cocina Integral")');
  await page.click('label:has-text("Zona de lavandería")');
  await page.click('label:has-text("Aire Acondicionado")');
  await page.click('label:has-text("Alarma")');
  await page.click('label:has-text("Amoblado")');
  await page.click('label:has-text("Baño Auxiliar")');

  // 14. Seleccionar checkboxes de exteriores
  await page.click('label:has-text("Ascensor")');
  await page.click('label:has-text("En conjunto cerrado")');
  await page.click('label:has-text("Garaje(s)")');
  await page.click('label:has-text("Parqueadero Visitantes")');

  // 15. Seleccionar checkboxes de sector
  await page.click('label:has-text("Colegios / Universidades")');
  await page.click('label:has-text("Parques cercanos")');
  await page.click('label:has-text("Sobre vía principal")');
  await page.click('label:has-text("Supermercados / C.Comerciales")');

  // 16. Seleccionar agente
  await page.click('text=agente1@fincaraiz.com.co');

  // 17. Subir fotos
  await page.setInputFiles('input[type="file"]', [
    'C:/Users/JohnRios/Desktop/Finca/imagenes/avivir_1.jpg',
    'C:/Users/JohnRios/Desktop/Finca/imagenes/recanto-render-noviembre-2020_1.jpg',
    'C:/Users/JohnRios/Desktop/Finca/imagenes/render-montecielo2.jpg',
  ]);

  // El flujo puede continuar con datos de contacto, video, y publicación según sea necesario
  // await page.fill('input[placeholder*="Video de Youtube"]', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  await page.click('button:has-text("Publicar")');

  // pendiente click en publicar
}); 