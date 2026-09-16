import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto("http://localhost:3000/kontak", { waitUntil: "networkidle" });

const r = [];
// Jam operasional
r.push(["Jam operasional Senin-Jumat", await page.locator("text=Senin – Jumat").isVisible(), true]);
r.push(["Jam operasional Sabtu-Minggu", await page.locator("text=Sabtu – Minggu").isVisible(), true]);
r.push(["Waktu 09.00-16.00", await page.locator("text=09.00 – 16.00 WIB").isVisible(), true]);
r.push(["Waktu 08.00-13.00", await page.locator("text=08.00 – 13.00 WIB").isVisible(), true]);
// Kontak
r.push(["Email sales@cmmm", await page.locator("text=sales@cmmm.co.id").isVisible(), true]);
r.push(["WhatsApp", await page.locator("text=+62 812-3456-7890").isVisible(), true]);
r.push(["Head Office Pasuruan", await page.locator("text=Pasuruan, Jawa Timur").isVisible(), true]);
r.push(["WeChat + Line QR ada", (await page.locator('img[alt*="QR Code"]').count()) >= 2, true]);
// QR image
const qr = await page.locator('img[alt*="WeChat"]');
r.push(["QR WeChat tampil", await qr.count() > 0 && await qr.isVisible(), true]);
// Sosmed
for (const s of ["Instagram", "Facebook", "YouTube", "LinkedIn"]) {
  r.push([`Sosmed ${s}`, await page.locator(`text=${s}`).isVisible(), true]);
}
// Legal links (scroll ke footer)
  await page.evaluate(() => document.getElementById("kontak").scrollIntoView());
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  for (const l of ["Term Service", "Privacy Policy", "Terms and Condition", "Return and Refund", "Sample and Logistic", "Shipping", "Payment"]) {
    const links = page.locator(`text=${l}`);
    let vis = false;
    for (let i = 0; i < (await links.count()); i++) {
      if (await links.nth(i).isVisible()) { vis = true; break; }
    }
    r.push([`Legal ${l}`, vis, true]);
  }
  // Copyright
  const cr = page.locator("text=All rights reserved");
  let crVis = false;
  for (let i = 0; i < (await cr.count()); i++) {
    if (await cr.nth(i).isVisible()) { crVis = true; break; }
  }
  r.push(["Copyright tampil", crVis, true]);

console.log("\n[HONEYPOT SILENT]");
// Isi form valid
await page.fill("#nama", "Test");
await page.fill("#email", "t@x.com");
await page.fill("#perusahaan", "X");
await page.$eval("#website", (el) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(el, "spam.com");
});
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
const success = await page.locator("text=Terima kasih!").isVisible().catch(() => false);
r.push(["Honeypot silent (no success)", !success, true]);
console.log(r.map(([n,a,e]) => `${a===e?"✅":"❌"} ${n} (exp ${e}, got ${a})`).join("\n"));
const all = r.every(([,a,e])=>a===e);
console.log(all ? "\n✅ SEMUA PAS" : "\n❌ ADA GAGAL");
await browser.close();
