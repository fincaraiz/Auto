<<<<<<< HEAD
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
=======
import { test, expect } from "@playwright/test";

test.describe("User to go to fincaraiz.com.co", async () => {
  test("User to go to fincaraiz.com.co", async ({ page }) => {
    test.step("user go to url", async () => {
      await page.goto("https://www.fincaraiz.com.co/");
    });

    await test.step("then the user can see the page", async () => {
      await expect(page).toHaveTitle(/Fincaraiz/);
    });
  });

  test("get started link", async ({ page }) => {
    await test.step("user go to url", async () => {
      await page.goto("https://www.fincaraiz.com.co/");
    });

    await test.step("then the user can see the page", async () => {
      await expect(page).toHaveTitle(/Fincaraiz/);
    });
  });
>>>>>>> 8d6b471 (Initial commit)
});
