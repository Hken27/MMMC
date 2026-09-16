import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();

// Listen console logs
page.on("console", (msg) => {
  if (msg.text().includes("honeypot") || msg.text().includes("website") || msg.text().includes("SUBMIT"))
    console.log("BROWSER:", msg.text());
});

await page.goto("http://localhost:3000/kontak", { waitUntil: "networkidle" });

// Inject FormData logging before submit
await page.evaluate(() => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    console.log("honeypot FormData.get('website'):", JSON.stringify(fd.get("website")));
    console.log("honeypot all entries:", JSON.stringify([...fd.entries()]));
  }, { capture: true });
});

// Set honeypot + fill valid
await page.$eval("#website", (el) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(el, "spam@test.com");
  el.dispatchEvent(new Event("input", { bubbles: true }));
});
await page.fill("#nama", "Bot");
await page.fill("#email", "bot@x.com");
await page.fill("#perusahaan", "X");

await page.click('button[type="submit"]');
await page.waitForTimeout(500);

await browser.close();
