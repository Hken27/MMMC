import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
page.on("dialog", async (d) => await d.accept());
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("produk").scrollIntoView());
await page.waitForTimeout(400);

// First calc container
const configs = page.locator("text=Konfigurasi Order");
console.log("config count:", await configs.count());
for (let i=0;i<await configs.count();i++){
  const vis = await configs.nth(i).isVisible();
  console.log(`config ${i} visible: ${vis}`);
}

// Check calc 1 buttons visible
const chk = await page.locator('button:has-text("20 ft container")').all();
console.log("20ft buttons:", chk.length);
const m10 = await page.locator('button:has-text("Master Box 10 kg")').first().isVisible();
console.log("MasterBox10 visible:", m10);
const fob = await page.locator('button:has-text("FOB")').first().isVisible();
console.log("FOB visible:", fob);

// click them on first calc
const calcFirst = configs.first();
const parent = calcFirst.locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]");
await parent.locator('button:has-text("20 ft container")').first().click().catch(()=>console.log("MOQ 20ft click fail"));
await parent.locator('button:has-text("Master Box 10 kg")').first().click().catch(()=>console.log("pkg click fail"));
await parent.locator('button:has-text("FOB")').first().click().catch(()=>console.log("ship click fail"));
const qty = parent.locator('input[type="number"]');
console.log("qty in calc1 count:", await qty.count());
if (await qty.count()) {
  await qty.fill("500");
  await page.waitForTimeout(300);
}
const subtotal = await parent.locator("text=Subtotal").count();
console.log("subtotal in calc1:", subtotal);
if (subtotal) {
  const txt = await parent.locator("text=Subtotal").first().textContent();
  console.log("subtotal text:", txt);
}
// check error (lengkapi)
const err = await parent.locator("text=Lengkapi semua").count();
console.log("error msg:", err);
const total = await parent.locator("text=Rp").last().isVisible().catch(()=>false);
console.log("total Rp visible:", total);

await browser.close();
