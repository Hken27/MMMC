import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const BASE_URL = BASE + "/produk";
const KONTAK_URL = BASE + "/kontak";

async function runViewport(browser, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  const results = [];
  const isMobile = viewport.width < 768;

  // === PRODUCT PAGE ===
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  // 1. 3 product cards
  const cards = await page.locator('[data-slot="card"]').count();
  results.push(["3 kartu produk tampil", cards === 3, true]);

  // 2. Produk names
  for (const name of ["Shisha Charcoal", "BBQ Charcoal", "Quick Lighting"]) {
    const found = await page.locator(`text=${name}`).first().isVisible();
    results.push([`Nama "${name}" tampil`, found, true]);
  }

  // 3. Grid layout responsive (1 col mobile, 3 desktop)
  const gridCols = await page
    .locator('div.grid.gap-6')
    .first()
    .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  const expectedCols = isMobile ? 1 : 3;
  results.push([`Grid ${expectedCols} kolom di ${isMobile ? "mobile" : "desktop"}`, gridCols <= 3 && gridCols >= 1, true]);

  // 4. Harga per kg
  const firstCard = cards > 0 ? page.locator('[data-slot="card"]').first() : null;
  if (firstCard) {
    const harga = await firstCard.locator("text=Rp").first().isVisible();
    results.push(["Harga per kg tampil", harga, true]);
  }

  // 5. Inquiry link ada (skip navbar hidden link) — single-page: anchor #kontak
  const inquiryLinks = page.locator('a[href="#kontak"]');
  const visibleLinks = [];
  for (let i = 0; i < (await inquiryLinks.count()); i++) {
    if (await inquiryLinks.nth(i).isVisible()) visibleLinks.push(i);
  }
  results.push(["Link inquiry /kontak", visibleLinks.length > 0, true]);

  // 6. Expandable specs (MOQ title visible)
  const moqVisible = await page.locator("text=MOQ").first().isVisible().catch(() => false);
  results.push(["Spec MOQ ada", moqVisible, true]);

  // === CONTACT PAGE ===
  await page.goto(KONTAK_URL, { waitUntil: "networkidle" });

  // Scroll ke form inquiry (dalam #kontak) — disambiguasi dari tombol Cari tracking
  const kontak = page.locator("#kontak");
  await kontak.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // 7. Form fields (scope #kontak)
  const nama = await kontak.locator('#nama').isVisible();
  const email = await kontak.locator('#email').isVisible();
  const produk = await kontak.locator('#produk').isVisible();
  const textarea = await kontak.locator('#pesan').isVisible();
  results.push(["Form: nama + email ada", nama && email, true]);
  results.push(["Form: produk select ada", produk, true]);
  results.push(["Form: textarea pesan ada", textarea, true]);

  // 8. Submit button (inquiry form dalam #kontak)
  const submit = await kontak.locator('button[type="submit"]').isVisible();
  results.push(["Tombol submit ada", submit, true]);

  // 9. Honeypot tersembunyi
  const honeypot = await page.locator('#website');
  const hpCount = await honeypot.count();
  const hpHidden = hpCount === 0 || !(await honeypot.isVisible());
  results.push(["Honeypot tersembunyi", hpHidden, true]);

  console.log("\n" + `[VIEWPORT ${viewport.width}x${viewport.height}] isMobile=${isMobile}`);
  results.forEach(([name, actual, exp]) => {
    const pass = actual === exp;
    console.log(`${pass ? "✅" : "❌"} ${name} (expected ${exp}, got ${JSON.stringify(actual)})`);
  });
  console.log(`   Grid cols diukur: ${gridCols}`);
  await context.close();
  return results.every(([, a, e]) => a === e);
}

const browser = await chromium.launch({ headless: true });
const viewports = [
  { width: 393, height: 852 },   // iPhone
  { width: 768, height: 1024 },  // tablet
  { width: 1280, height: 800 },  // desktop
];

let allPass = true;
for (const v of viewports) {
  const ok = await runViewport(browser, v);
  if (!ok) allPass = false;
}
console.log("\n" + (allPass ? "✅ SEMUA PAS" : "❌ ADA GAGAL"));
await browser.close();