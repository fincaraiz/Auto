import { test, expect } from "@playwright/test";

test.describe("FincaRaíz UI Analysis", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/Front_finca.html");
  });

  test("should have proper header structure", async ({ page }) => {
    // Check navbar
    const navbar = await page.locator(".navbar");
    await expect(navbar).toBeVisible();

    // Check brand section
    const brand = await page.locator(".brand");
    await expect(brand).toBeVisible();

    const logo = await page.locator(".logo-desktop");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("src", "logofinca.jpg");
    await expect(logo).toHaveAttribute("alt", "logo");

    // Check navigation links
    const navLinks = await page.locator(".main-nav a");
    await expect(navLinks).toHaveCount(7);

    // Check if all navigation links are visible and have correct text
    const expectedLinks = [
      "Proyectos de vivienda",
      "Venta",
      "Arriendo",
      "Inmobiliarias",
      "Constructoras",
      "Noticias",
      "Vivienda VIS",
    ];

    for (let i = 0; i < expectedLinks.length; i++) {
      await expect(navLinks.nth(i)).toHaveText(expectedLinks[i]);
    }
  });

  test("should have functional search section", async ({ page }) => {
    // Check hero section
    const hero = await page.locator(".hero");
    await expect(hero).toBeVisible();

    // Check hero title
    const heroTitle = await page.locator(".hero h1");
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toHaveText("Lo mejor de buscar es encontrar");

    // Check tabs
    const tabs = await page.locator(".tabs button");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.first()).toHaveClass(/active/);

    // Check search inputs
    const searchInputs = await page.locator(".search-bar input");
    await expect(searchInputs).toHaveCount(2);
    await expect(searchInputs.first()).toHaveAttribute(
      "placeholder",
      "Casa, Apartamento..."
    );
    await expect(searchInputs.nth(1)).toHaveAttribute(
      "placeholder",
      "Busca por ubicación"
    );

    // Check search buttons
    const searchBtn = await page.locator(".search-btn");
    const codeBtn = await page.locator(".code-btn");
    await expect(searchBtn).toBeVisible();
    await expect(codeBtn).toBeVisible();
    await expect(searchBtn).toHaveText("🔍");
    await expect(codeBtn).toHaveText("Buscar por código");
  });

  test("should have proper real estate section", async ({ page }) => {
    // Check inmobiliarias section
    const inmobiliarias = await page.locator(".inmobiliarias");
    await expect(inmobiliarias).toBeVisible();

    // Check section title
    const sectionTitle = await page.locator(".inmobiliarias h2");
    await expect(sectionTitle).toBeVisible();
    await expect(sectionTitle).toHaveText("INMOBILIARIAS");

    // Check partner logos
    const partnerLogos = await page.locator(".partner-logo");
    await expect(partnerLogos).toHaveCount(4);

    const expectedPartners = ["PADS", "A&R", "Santa Fe", "BRIKSS"];
    for (let i = 0; i < expectedPartners.length; i++) {
      await expect(partnerLogos.nth(i)).toHaveText(expectedPartners[i]);
    }
  });

  test("should be responsive", async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileNav = await page.locator(".navbar");
    await expect(mobileNav).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletNav = await page.locator(".navbar");
    await expect(tabletNav).toBeVisible();

    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopNav = await page.locator(".navbar");
    await expect(desktopNav).toBeVisible();
  });

  test("mobile menu functionality", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if mobile menu button is visible
    const mobileMenuBtn = await page.locator(".mobile-menu-btn");
    await expect(mobileMenuBtn).toBeVisible();

    // Check if menu is initially hidden
    const mainNav = await page.locator(".main-nav");
    await expect(mainNav).not.toHaveClass(/active/);

    // Click mobile menu button
    await mobileMenuBtn.click();

    // Check if menu is now visible
    await expect(mainNav).toHaveClass(/active/);
    await expect(mobileMenuBtn).toHaveClass(/active/);

    // Check if overlay is visible
    const overlay = await page.locator(".mobile-menu-overlay");
    await expect(overlay).toHaveClass(/active/);

    // Check if menu links are visible
    const navLinks = await page.locator(".main-nav a");
    await expect(navLinks).toHaveCount(7);
    for (let i = 0; i < 7; i++) {
      await expect(navLinks.nth(i)).toBeVisible();
    }

    // Click overlay to close menu
    await overlay.click();

    // Check if menu is hidden again
    await expect(mainNav).not.toHaveClass(/active/);
    await expect(mobileMenuBtn).not.toHaveClass(/active/);
    await expect(overlay).not.toHaveClass(/active/);
  });

  test("responsive design", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopNav = await page.locator(".navbar");
    await expect(desktopNav).toBeVisible();
    await expect(page.locator(".mobile-menu-btn")).not.toBeVisible();
    await expect(page.locator(".main-nav")).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".mobile-menu-btn")).toBeVisible();
    await expect(page.locator(".main-nav")).not.toHaveClass(/active/);

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator(".mobile-menu-btn")).toBeVisible();
    await expect(page.locator(".main-nav")).not.toHaveClass(/active/);
  });

  test("interactive elements", async ({ page }) => {
    // Test tab switching
    const tabs = await page.locator(".tabs button");
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveClass(/active/);
    await expect(tabs.first()).not.toHaveClass(/active/);

    // Test search input interaction
    const searchInput = await page.locator(".search-bar input").first();
    await searchInput.fill("Apartamento en Bogotá");
    await expect(searchInput).toHaveValue("Apartamento en Bogotá");

    // Test button hover states
    const loginBtn = await page.locator(".login");
    await loginBtn.hover();
    await expect(loginBtn).toHaveCSS("border-color", "rgb(52, 152, 219)");

    const publishBtn = await page.locator(".publish");
    await publishBtn.hover();
    await expect(publishBtn).toHaveCSS("background-color", "rgb(52, 152, 219)");
  });
});
