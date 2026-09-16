import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });

const BASE = "http://localhost:3000/";
async function run(viewport, name) {
  const page = await (await (await browser.newContext({ viewport })).newPage());
  console.log(`\n[${name} ${viewport.width}x${viewport.height}]`);
  const r = [];
  await page.goto(BASE, { waitUntil: "networkidle" });

  // Service section ada + roadmap 5 tahap
  const svc = page.locator("#service");
  const svcOk = await svc.isVisible().catch(()=>false);
  r.push(["Section #service ada", svcOk, true]);

  // 5 tahap roadmap
  let r5 = true;
  for (const t of ["Login Account","Order Product","Transaction","Delivery","Order Completed"]) {
    const v = await page.locator(`h4:has-text("${t}")`).first().isVisible().catch(()=>false);
    if (!v) r5 = false;
  }
  r.push(["Roadmap 5 tahap", r5, true]);

  // Order tracking input
  const tracking = await page.locator('input[placeholder="Masukkan Order ID"]').isVisible().catch(()=>false);
  r.push(["Tracking input order ID", tracking, true]);

  // Company Certifications
  const certHeader = await page.locator("#service h4:has-text('Company Certifications'), #service h4:has-text('Company Certifications')").first().isVisible().catch(()=>false);
  r.push(["Header Company Certifications", certHeader, true]);

  // ISO.pdf ISO link new tab
  const iso = page.locator('a[href*="ISO.pdf"]').first();
  const isoNewTab = await iso.getAttribute("target").then((t)=>t==="_blank");
  const isoRel = await iso.getAttribute("rel").then((t)=>t?.includes("noopener"));
  r.push(["ISO link new tab aman", isoNewTab && isoRel, true]);

  // Grand total
  const grand = await page.locator("text=Grand Total").first().isVisible().catch(()=>false);
  r.push(["Grand Total tampil", grand, true]);

  const pass = r.every(([,a,e])=>a===e);
  r.forEach(([n,a,e])=>console.log(`${a===e?"✅":"❌"} ${n} (exp ${e}, got ${a})`));
  return pass;
}

let all = true;
for (const [v,n] of [[{width:393,height:852},"MOBILE"],[{width:768,height:1024},"TABLET"],[{width:1280,height:800},"DESKTOP"]]) {
  if (!(await run(v,n))) all = false;
}
console.log("\n" + (all ? "✅ SEMUA PAS" : "❌ ADA GAGAL"));
await browser.close();
