import { chromium } from "playwright";

const describe = (t) => console.log(`\n[VIEWPORT ${t.width}x${t.height}]`);

async function runViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport,
    userAgent: viewport.width < 768 ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" : "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36",
  });
  const page = await context.newPage();

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const results = [];
  const isMobile = viewport.width < 768;

  // 1. Hamburger presence
  const hamburger = await page.$('button[aria-label="Buka menu"], button[aria-label="Tutup menu"]');
  const hamburgerVisible = hamburger ? await hamburger.isVisible() : false;

  // 2. Desktop nav links visibility
  const desktopNav = await page.$('nav[aria-label="Navigasi utama"] a[href="/produk"]');
  const desktopVisible = desktopNav ? await desktopNav.isVisible() : false;

  // 3. Brand present
  const brand = await page.locator('a[href="/"]:has-text("CMMM")').first();
  const brandVisible = await brand.isVisible();

  // 4. Click hamburger → drawer opens
  let drawerVisible = false;
  let ariaExpanded = null;
  if (isMobile && hamburger) {
    await hamburger.click();
    await page.waitForTimeout(600); // motion spring
    ariaExpanded = await hamburger.getAttribute("aria-expanded");
    const drawer = await page.$('div[role="dialog"][aria-label="Menu navigasi"]');
    drawerVisible = drawer ? await drawer.isVisible() : false;
  }

  // 5. Drawer links navigable
  let drawerLinkOk = false;
  if (isMobile && drawerVisible) {
    const dl = await page.$('div[role="dialog"] a[href="/produk"]');
    drawerLinkOk = dl ? await dl.isVisible() : false;
  }

  results.push(
    ["Hamburger tampil", hamburgerVisible, isMobile],
    ["Desktop nav tersembunyi di mobile", !desktopVisible, isMobile],
    ["Brand tampil", brandVisible, true],
    ["Drawer terbuka saat klik", drawerVisible, isMobile],
    ["aria-expanded=true saat buka", ariaExpanded === "true", isMobile],
    ["Link drawer navigable", drawerLinkOk, isMobile],
  );

  console.log(`isMobile=${isMobile}`);
  results.forEach(([name, actual, expectedTruthy]) => {
    const pass = actual === expectedTruthy;
    console.log(`${pass ? "✅" : "❌"} ${name} (expected ${expectedTruthy}, got ${JSON.stringify(actual)})`);
  });

  await context.close();
  return results.every(([, actual, exp]) => actual === exp);
}

const browser = await chromium.launch({ headless: true });
const viewports = [
  { width: 393, height: 852 },  // iPhone 14 Pro (iOS)
  { width: 412, height: 915 },  // Android Pixel 7
  { width: 768, height: 1024 }, // tablet boundary exact
  { width: 1280, height: 800 }, // desktop
];

let allPass = true;
for (const v of viewports) {
  describe(v);
  const ok = await runViewport(browser, v);
  if (!ok) allPass = false;
}
console.log("\n" + (allPass ? "✅ SEMUA PAS" : "❌ ADA GAGAL"));
await browser.close();