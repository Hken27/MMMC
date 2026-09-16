import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const hamburger = page.locator('button[aria-label="Buka menu"]');
await hamburger.click();
await page.waitForTimeout(700);

// check aria-label after open
const label = await page.locator('button[aria-label="Buka menu"], button[aria-label="Tutup menu"]').first().getAttribute("aria-label");
console.log("label after open:", label);

// drawer dialog visible
const dialog = page.locator('div[role="dialog"]');
const dialogVisible = await dialog.count() ? await dialog.first().isVisible() : false;
console.log("dialog visible:", dialogVisible);

// anchors in drawer
for (const h of ["#home","#produk","#service","#kontak"]) {
  const a = page.locator(`a[href="${h}"]`);
  const vis = [];
  for (let i=0;i<await a.count();i++) if (await a.nth(i).isVisible()) {
    vis.push({i, txt: (await a.nth(i).textContent()).trim()});
  }
  console.log(`${h}: count=${await a.count()} visible=${JSON.stringify(vis)}`);
}
await browser.close();
