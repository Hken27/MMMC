import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

// is hamburger there?
const hamburger = page.locator('button[aria-label="Buka menu"]');
console.log("hamburger count:", await hamburger.count());
await hamburger.click();
await page.waitForTimeout(600);
console.log("aria-expanded:", await hamburger.getAttribute("aria-expanded"));

// drawer?
const dialog = page.locator('div[role="dialog"]');
console.log("dialog count:", await dialog.count());
if (await dialog.count()) {
  console.log("dialog visible:", await dialog.first().isVisible());
}
// anchor links in drawer?
for (const h of ["#home","#produk","#service","#kontak"]) {
  const a = page.locator(`a[href="${h}"]`);
  const visibleOnes = [];
  for (let i=0;i<await a.count();i++) if (await a.nth(i).isVisible()) visibleOnes.push(i);
  console.log(`a[href=${h}] count=${await a.count()} visible=${JSON.stringify(visibleOnes)}`);
}
await browser.close();
