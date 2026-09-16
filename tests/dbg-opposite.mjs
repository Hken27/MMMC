import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const viewport = { width: 1280, height: 800 };
const page = await (await (await browser.newContext({ viewport })).newPage());
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

// Inisialisasi: catat posisi awal kedua carousel
const cert = page.locator('section#service [role="region"][aria-label*="Sert"]').first();
const flags = page.locator('section#service [role="region"][aria-label*="Negar"]').first();
await page.evaluate(() => document.querySelectorAll("section#service [role='region']").forEach(el=>el.scrollIntoView()));

await page.waitForTimeout(400溯?) wait no I never scroll into one viewport? need both visible; #service panjang → carousel cert di atas flags (keduanya dalam section yg sama, layar 1280x800):
const certBox = await cert.boundingBox();
const flagsBox = await flags.boundingBox();
console.log("cert box:", certBox && Math.round(certBox.y), "flags box:", flagsBox && Math.round(flagsBox.y));

// posisi awal
const c0 = await cert.evaluate((el)=>({l:el.scrollLeft, w:el.scrollWidth}));
const f0 = await flags.evaluate((el)=>({l:el.scrollLeft, w:el.scrollWidth}));
console.log("t0 cert.l=", c0.l, "flags.l=", f0.l);

// tunggu ~3.6s (melebihi interval 3.2s) — dua-duanya harus bergerak:
await page.waitForTimeout(3600);
const c1 = await cert.evaluate((el)=>({l:el.scrollLeft}));
const f1 = await flags.evaluate((el)=>({l:el.scrollLeft}));
console.log("t1 cert.l=", c1.l, "(delta=", c1.l-c0.l, ") flags.l=", f1.l, "(delta=", f1.l-f0.l, ")");

// GRAND TOTAL: satu bertambah + (KANAN) satu bertambah − (KIRI) = OPPOSITE
const certRight = c1.l > c0.l;   // sertifikasi auto scroll kanan
const flagsLeft = f1.l < f0.l;   // flags auto scroll kiri
const opposite = certRight && flagsLeft;
console.log("\nCANVAS: cert kanan +", certRight, "&& flags kiri −", flagsLeft, "→ OPPOSITE:", opposite);

await browser.close();
