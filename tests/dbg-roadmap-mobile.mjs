import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("service").scrollIntoView());
await page.waitForTimeout(500);
for (const s of ["Login Account","Order Product","Transaction","Delivery","Order Completed"]) {
  const loc = page.locator(`text=${s}`).first();
  const vis = await loc.isVisible().catch(()=>false);
  const txt = await loc.textContent().catch(()=> "?");
  console.log(`${s}: visible=${vis} text="${txt.trim()}"`);
}
await browser.close();
