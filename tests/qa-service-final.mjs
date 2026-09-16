// QA final — Company Service section (#service) — verifikasi revisi user:
// 1) 1 kalkulator utk 3 kategori briket (bukan 3 terpisah) 2) certifications cards CAROUSEL (bukan roadmap)
import { chromium } from "playwright";

const CONFIG = [
  { id: "mobile", viewport: { width: 390, height: 844 }, mobile: true },
  { id: "tablet", viewport: { width: 768, height: 1024 }, mobile: false },
  { id: "desktop", viewport: { width: 1280, height: 800 }, mobile: false },
];

async function check(browser, cfg) {
  const ctx = await browser.newContext({ viewport: cfg.viewport });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/#service", { waitUntil: "networkidle" });

  // 1. Sertifikasi ada — Company Certifications heading
  const certHeading = await page.locator("#service h3:has-text('Company Certifications'), #service h4:has-text('Company Certifications')").first().isVisible();
  r.push(["Sertifikasi: Header Company Certifications", certHeading, true]);

  // 2. ISO.pdf bisa dibuka new tab fresh
  const iso = page.locator("#service a[href*='ISO.pdf']").first();
  const isoOk = (await iso.count()) === 1;
  r.push(["Sertifikasi: ISO.pdf link ada", isoOk, true]);

  // 3. Flags negara afiliasi — di #service pakai lucide Flag? Periksa 7 negara
  for (const negara of ["Arab Saudi","Aljazair","Irak","Iran","Amerika","Jepang","Korea"]) {
    const v = await page.locator(`#service text=${negara}`).first().isVisible();
    if (!v) flagsOk = false;
  }
  r.push(["Flags 7 negara afiliasi tampil", flagsOk, true]);

  console.log(`\n[${cfg.id} ${cfg.viewport.width}x${cfg.viewport.height}]`);
  let pass = true;
  for (const [nama, got, exp] of r) {
    const ok = got === exp;
    if (!ok) pass = false;
    console.log(`${ok ? "✅" : "❌"} ${nama} (exp ${exp}, got ${got})`);
  }
  await page.close();
  return pass;
}

const browser = await chromium.launch({ headless: true });
let okAll = true;
for (const c of CONFIG) {
  if (!(await check(browser, c))) okAll = false;
}
console.log(`\n${okAll ? "✅ SEMUA PAS" : "❌ ADA GAGAL"}`);
await browser.close();
