import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await page.goto("http://localhost:3000/kontak", { waitUntil: "networkidle" });

// check if honeypot input is in DOM
const hp = await page.locator('#website').count();
console.log("honeypot #website count:", hp);

// Set value via native setter + submit
await page.$eval("#website", (el) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(el, "spam@test.com");
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
});
const val = await page.$eval("#website", (el) => el.value);
console.log("DOM value after set:", JSON.stringify(val));

// Fill valid data
await page.fill("#nama", "Bot");
await page.fill("#email", "bot@x.com");
await page.fill("#perusahaan", "X");

// Submit and check FormData
await page.$eval("form", (f) => {
  const fd = new FormData(f);
  console.log("website from FormData:", fd.get("website"));
});

// Intercept form submit
await page.evaluate(() => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    const fd = new FormData(form);
    console.log("SUBMIT website:", fd.get("website"));
  });
});

await page.click('button[type="submit"]');
await page.waitForTimeout(1500);

const success = await page.locator("text=Terima kasih!").first().isVisible().catch(() => false);
console.log("success msg:", success);

await browser.close();
