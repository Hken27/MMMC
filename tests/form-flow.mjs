import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await page.goto("http://localhost:3000/kontak", { waitUntil: "networkidle" });

// Isi form valid
await page.fill("#nama", "Budi Santoso");
await page.fill("#email", "budi@company.com");
await page.fill("#perusahaan", "PT Maju Jaya");
await page.fill("#qty", "1000");
await page.fill("#pesan", "Butuh 1 kontainer 20ft ke Dubai");
await page.click('#produk');
await page.waitForTimeout(300);
await page.keyboard.press("Enter");
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
const success = await page.locator("text=Terima kasih!").first().isVisible().catch(() => false);
console.log(success ? "✅ VALID: success message tampil" : "❌ success msg tidak muncul");

// Reload: Test honeypot — set field hidden via JS (bypass visibility)
await page.goto("http://localhost:3000/kontak", { waitUntil: "networkidle" });
await page.fill("#nama", "Bot");
await page.fill("#email", "bot@x.com");
await page.fill("#perusahaan", "X");
await page.$eval("#website", (el) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(el, "http://spam.com");
  el.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const premature = await page.locator("text=Terima kasih!").first().isVisible().catch(() => false);
console.log(premature ? "❌ honeypot bocor (show success)" : "✅ honeypot menahan (no success)");

await browser.close();
