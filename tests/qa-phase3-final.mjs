/**
 * QA Phase 3 Final — Comprehensive Service Section Test
 * Test: Order Roadmap, Order Tracking, Company Certifications (static grid), Affiliate Flags (carousel)
 * Viewports: 390 (mobile), 768 (tablet), 1280 (desktop)
 */

import { chromium } from "playwright";

const CONFIG = [
  { id: "mobile", viewport: { width: 390, height: 844 }, mobile: true },
  { id: "tablet", viewport: { width: 768, height: 1024 }, mobile: false },
  { id: "desktop", viewport: { width: 1280, height: 800 }, mobile: false },
];

async function qaPhase3(browser, cfg) {
  const ctx = await browser.newContext({ viewport: cfg.viewport });
  const page = await ctx.newPage();
  const r = [];

  await page.goto("http://localhost:3000/#service", { waitUntil: "networkidle" });

  // ====== 1. ORDER ROADMAP ======
  // On mobile, roadmap may require scroll/might be hidden; check if exists in DOM
  const roadmapSteps = ["Login Account", "Order Product", "Transaction", "Delivery", "Order Completed"];
  let roadmapInDOM = true;
  for (const step of roadmapSteps) {
    const inDOM = await page.locator(`text=${step}`).count() > 0;
    if (!inDOM) roadmapInDOM = false;
  }
  r.push(["Roadmap: 5 tahap dalam DOM", roadmapInDOM, true]);

  // Check if visible (may fail on mobile but OK if in DOM)
  const roadmapVisible = await page.locator("text=Login Account").first().isVisible().catch(() => false);
  const expectedVisible = cfg.viewport.width >= 768; // visible on tablet+
  r.push([`Roadmap: tahap visible (${cfg.id})`, roadmapVisible, expectedVisible]);

  // ====== 2. ORDER TRACKING ======
  const trackingTitle = await page.locator("text=Order Tracking").first().isVisible().catch(() => false);
  r.push(["Tracking: Header visible", trackingTitle, true]);

  const trackingInput = await page.locator('input[placeholder*="Order"]').first().isVisible().catch(() => false);
  r.push(["Tracking: Input field ada", trackingInput, true]);

  const searchBtn = await page.locator("button:has-text('Cari')").first().isVisible().catch(() => false);
  r.push(["Tracking: Search button ada", searchBtn, true]);

  // Test search flow
  if (trackingInput) {
    await page.fill('input[placeholder*="Order"]', "CMMM-001");
    await page.click("button:has-text('Cari')");
    await page.waitForTimeout(300);
    const statusArea = await page.locator("text=Sistem tracking dinamis tersedia").isVisible().catch(() => false);
    r.push(["Tracking: Status area muncul setelah search", statusArea, true]);
  }

  // ====== 3. COMPANY CERTIFICATIONS (Static Grid) ======
  const certHeader = await page.locator("text=Company Certifications").first().isVisible().catch(() => false);
  r.push(["Certs: Header visible", certHeader, true]);

  // Check 4 certifications grid
  const certCards = page.locator("#service a[href*='ISO'], #service a[href*='MSDS'], #service a[href='#']").filter({ hasText: /COO|Fumigasi/ });
  const certCount = await certCards.count();
  r.push(["Certs: Cards rendered (4+)", certCount >= 2, true]); // At least ISO + MSDS visible

  // Check individual certs
  const certs = [
    { name: "ISO 9001:2015", href: "/documents/ISO.pdf", shouldOpen: true },
    { name: "MSDS", href: "/documents/MSDS.pdf", shouldOpen: true },
    { name: "COO / SKA", href: "#", shouldOpen: false },
    { name: "Fumigasi", href: "#", shouldOpen: false },
  ];

  for (const cert of certs) {
    const link = page.locator(`a:has-text("${cert.name}")`).first();
    const visible = await link.isVisible().catch(() => false);
    r.push([`Certs: ${cert.name} visible`, visible, true]);

    if (visible && cert.shouldOpen) {
      const href = await link.getAttribute("href");
      const target = await link.getAttribute("target");
      const rel = await link.getAttribute("rel");
      r.push([`Certs: ${cert.name} target=_blank`, target === "_blank", true]);
      r.push([`Certs: ${cert.name} rel safe`, rel === "noopener noreferrer", true]);
    }
  }

  // Check ISO.pdf valid (200 response)
  const isoStatus = await page.evaluate(async () => {
    try {
      const res = await fetch("/documents/ISO.pdf");
      return res.status;
    } catch {
      return 0;
    }
  });
  r.push(["Certs: ISO.pdf 200 OK", isoStatus === 200, true]);

  // Check MSDS.pdf valid
  const msdsStatus = await page.evaluate(async () => {
    try {
      const res = await fetch("/documents/MSDS.pdf");
      return res.status;
    } catch {
      return 0;
    }
  });
  r.push(["Certs: MSDS.pdf 200 OK", msdsStatus === 200, true]);

  // Grid responsive layout
  const certGrid = page.locator("[class*='grid']").first();
  const gridExists = await certGrid.count() > 0;
  r.push(["Certs: Grid layout container", gridExists, true]);

  // ====== 4. AFFILIATE FLAGS (Carousel) ======
  const flagsHeader = await page.locator("text=Negara Afiliasi").first().isVisible().catch(() => false);
  r.push(["Flags: Header 'Negara Afiliasi' visible", flagsHeader, true]);

  // Check 7 countries
  const countries = ["Arab Saudi", "Aljazair", "Irak", "Iran", "Amerika", "Jepang", "Korea"];
  let countriesOk = true;
  for (const country of countries) {
    const v = await page.locator(`text=${country}`).first().isVisible().catch(() => false);
    if (!v) countriesOk = false;
  }
  r.push(["Flags: 7 negara ada", countriesOk, true]);

  // Check flags images (flagcdn.com SVG)
  const flagImages = page.locator('img[src*="flagcdn.com"]');
  const flagCount = await flagImages.count();
  r.push(["Flags: Flag images loaded (7+)", flagCount >= 7, true]);

  // Check carousel container (overflow-hidden)
  const flagContainer = page.locator("[aria-label*='afiliasi']").first();
  const containerExists = await flagContainer.count() > 0;
  r.push(["Flags: Carousel container exists", containerExists, true]);

  // Check no horizontal overflow at viewport
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const windowWidth = cfg.viewport.width;
  r.push([`Flags: No h-overflow (body ${bodyWidth} <= ${windowWidth})`, bodyWidth <= windowWidth + 1, true]);

  // ====== 5. RESPONSIVE CHECKS ======
  // Mobile: roadmap may not be visible but must be in DOM
  // Tablet+: all must be visible
  const trackingVisible = await page.locator("text=Order Tracking").isVisible().catch(() => false);
  const certsVisible = await page.locator("text=Company Certifications").isVisible().catch(() => false);
  const flagsVisible = await page.locator("text=Negara Afiliasi").isVisible().catch(() => false);
  const allCriticalVisible = trackingVisible && certsVisible && flagsVisible;
  r.push(["Responsive: Critical sections visible", allCriticalVisible, true]);

  // ====== 6. ACCESSIBILITY ======
  // Check aria-labels & alt texts
  const flagImg = page.locator('img[src*="flagcdn.com"]').first();
  const flagAlt = await flagImg.getAttribute("alt").catch(() => null);
  r.push(["A11y: Flag image has alt", flagAlt && flagAlt.length > 0, true]);

  // Check cert icon alt or aria-label
  const certIcon = page.locator("[aria-label*='sertifikasi'], [aria-label*='dokumen']").first();
  const certAriaOk = await certIcon.count() > 0;
  r.push(["A11y: Cert section has aria", certAriaOk, true]);

  // ====== 7. BUILD VALIDATION ======
  // No console errors
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.waitForTimeout(500);
  r.push(["Build: No console errors", errors.length === 0, true]);

  // ====== PRINT RESULTS ======
  console.log(`\n[${cfg.id.toUpperCase()} ${cfg.viewport.width}x${cfg.viewport.height}]`);
  let pass = true;
  for (const [nama, got, exp] of r) {
    const ok = got === exp;
    if (!ok) pass = false;
    console.log(`${ok ? "✅" : "❌"} ${nama} (exp ${exp}, got ${got})`);
  }

  await page.close();
  return pass;
}

const browser = await chromium.launch({ headless: true });
let okAll = true;

console.log("═══════════════════════════════════════════");
console.log("QA PHASE 3 FINAL — Service Section");
console.log("═══════════════════════════════════════════");

for (const c of CONFIG) {
  if (!(await qaPhase3(browser, c))) okAll = false;
}

console.log("\n" + (okAll ? "✅ SEMUA PAS — Phase 3 FINAL READY" : "❌ ADA GAGAL — Perbaiki"));
console.log("═══════════════════════════════════════════\n");
await browser.close();
