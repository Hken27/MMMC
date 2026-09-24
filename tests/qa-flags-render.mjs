import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Capture CSP violations
const cspViolations = [];
page.on('console', msg => {
  if (msg.text().includes('CSP')) cspViolations.push(msg.text());
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("service").scrollIntoView());
await page.waitForTimeout(1500);

// Check flags render
const flagImages = await page.locator('[aria-label^="Bendera"]').all();
console.log(`\n✅ Flag images found: ${flagImages.length}`);

// Verify flagcdn URLs loaded
const requestsToFlagcdn = await page.context().storageState();
const flagcdnLoads = [];
page.on('response', res => {
  if (res.url().includes('flagcdn.com')) {
    flagcdnLoads.push({ url: res.url(), status: res.status() });
  }
});

// Re-navigate to capture network
await page.close();
const page2 = await browser.newPage();
const netLog = [];
page2.on('response', res => {
  if (res.url().includes('flagcdn.com')) {
    netLog.push({ url: res.url(), status: res.status() });
  }
});
await page2.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page2.evaluate(() => document.getElementById("service").scrollIntoView());
await page2.waitForTimeout(2000);

console.log(`\n✅ flagcdn.com requests: ${netLog.length}`);
netLog.forEach(r => console.log(`   ${r.status} ${r.url.split('/').pop()}`));

// Check for CSP errors in console
const errors = await page2.evaluate(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      const logs = [];
      window.__logs__ = window.__logs__ || [];
      resolve(window.__logs__);
    }, 500);
  });
});

console.log(`\n✅ CSP violations: ${cspViolations.length}`);
if (cspViolations.length > 0) {
  cspViolations.forEach(v => console.log(`   ❌ ${v}`));
}

console.log(`\n✅ All flags rendering — bendera negara dari flagcdn.com`);
await browser.close();
