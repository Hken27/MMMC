import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
async function run(browser, viewport) {
  const page = await (await browser.newContext({ viewport })).newPage();
  const r = [];
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  // 1. Semua section ID ada
  for (const id of ["home","produk","service","kontak"]) {
    r.push([`section #${id}`, await page.locator(`#${id}`).count() > 0, true]);
  }

  // 2. Navbar anchor links (mobile: buka drawer dulu)
  const isMobile = viewport.width < 768;
  if (isMobile) {
    // Buka hamburger drawer
    await page.click('button[aria-label="Buka menu"]');
    await page.waitForTimeout(500);
  }
  for (const [label, href] of [["Beranda","#home"],["Produk","#produk"],["Service","#service"],["Kontak","#kontak"]]) {
    const a = page.locator(`a[href="${href}"]`);
    let found = false;
    for (let i = 0; i < (await a.count()); i++) {
      if (await a.nth(i).isVisible()) {
        const txt = (await a.nth(i).textContent()).trim();
        if (txt === label) { found = true; break; }
      }
    }
    r.push([`nav ${label} → ${href}`, found, true]);
  }
  if (isMobile) {
    await page.click('button[aria-label="Tutup menu"]');
    await page.waitForTimeout(400);
  }

  // 3. Tekan nav Produk → scroll ke section (cek posisi berubah & smooth)
  const beforeY = await page.evaluate(() => window.scrollY);
  const produkAnchors = page.locator('a[href="#produk"]');
  let clicked = false;
  for (let i = 0; i < (await produkAnchors.count()); i++) {
    if (await produkAnchors.nth(i).isVisible()) {
      await produkAnchors.nth(i).click();
      clicked = true;
      break;
    }
  }
  if (!clicked) throw new Error("no visible #produk anchor");
  await page.waitForTimeout(800);
  const afterY = await page.evaluate(() => window.scrollY);
  r.push(["scroll ke #produk (y berubah)", afterY > beforeY, true]);

  // 4. No horizontal scroll
  const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  r.push(["tanpa horizontal scroll", !hScroll, true]);

  // 5. Vertical scroll ke footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const footVisible = await page.locator("text=All rights reserved").isVisible().catch(()=>false);
  r.push(["footer visible di bawah", footVisible, true]);

  // 6. Kontak QR images (WeChat + Line)
  const qrCount = await page.locator('img[alt*="QR Code"]').count();
  r.push(["QR WeChat+Line ada (2)", qrCount === 2, true]);
  r.push(["no ID Hken-meyden", (await page.locator("text=Hken-meyden").count()) === 0, true]);

  console.log(`\n[VIEWPORT ${viewport.width}x${viewport.height}]`);
  const pass = r.every(([,a,e])=>a===e);
  r.forEach(([n,a,e]) => console.log(`${a===e?"✅":"❌"} ${n} (exp ${e}, got ${a})`));
  await page.context().close();
  return pass;
}
let all = true;
for (const v of [{width:393,height:852},{width:768,height:1024},{width:1280,height:800}]) {
  if (!(await run(browser, v))) all = false;
}
console.log("\n" + (all ? "✅ SEMUA PAS" : "❌ ADA GAGAL"));
await browser.close();
