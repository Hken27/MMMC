import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });

async function run(browser, viewport) {
  const page = await (await browser.newContext({ viewport })).newPage();
  const r = [];
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  // === PHASE 3+ PRODUCT ORDER ===
  await page.evaluate(() => document.getElementById("produk").scrollIntoView());
  await page.waitForTimeout(400);

  // 1. Kalkulator 1 saja (bukan 3)
  const calcCount = await page.locator("text=Konfigurasi Order").count();
  r.push(["Kalkulator order (1 saja)", calcCount === 1, true]);

  // 2. Kategori selector (3 briket)
  let katOk = true;
  for (const k of ["Shisha Charcoal","BBQ Charcoal","Quick Lighting"]) {
    const vis = await page.locator(`button:has-text("${k}")`).first().isVisible().catch(()=>false);
    if (!vis) katOk = false;
  }
  r.push(["Kategori briket selector (3)", katOk, true]);

  // 3. Selector MOQ clickable
  const moqBtn = page.locator("text=20 ft container").first();
  const moqClickable = await moqBtn.isVisible();
  r.push(["MOQ button muncul", moqClickable, true]);

  // 4. Tab Domestik/Luar Negeri
  const dom = await page.locator("text=🇮🇩 Domestik").first().isVisible().catch(()=>false);
  const inter = await page.locator("text=🌏 Luar Negeri").first().isVisible().catch(()=>false);
  r.push(["Tab Domestik + Luar Negeri", dom && inter, true]);

  // 5. Grand total setelah pilih semua opsi
  const moq = page.locator("text=18 ft container (~12 ton)").first();
  if (await moq.isVisible()) { await moq.click(); }
  const pkg = page.locator("text=Master Box 10 kg").first();
  if (await pkg.isVisible()) { await pkg.click(); }
  const ship = page.locator("text=Indah Kargo").first(); // default domestik
  if (await ship.isVisible()) { await ship.click(); }
  const qtyInputs = page.locator('input[type="number"]');
  await qtyInputs.first().fill("500");
  await page.waitForTimeout(200);
  const grandTotal = await page.locator("text=Subtotal").first().isVisible().catch(()=>false);
  r.push(["Grand total tampil", grandTotal, true]);

  // 6. Login gating submit (prod order) — alert
  page.on("dialog", async (d) => { await d.accept(); });
  const kirimBtn = page.locator("button:has-text('Kirim Inquiry Sekarang')").first();
  const clickable = await kirimBtn.isVisible();
  r.push(["Button Kirim Inquiry Sekarang visible", clickable, true]);

  // === PHASE 4 SERVICE ===
  await page.evaluate(() => document.getElementById("service").scrollIntoView());
  await page.waitForTimeout(400);

  // 6. Roadmap 5 tahap (scope ke #service)
  const svc = page.locator("#service");
  let roadmapOk = true;
  for (const s of ["Login Account","Order Product","Transaction","Delivery","Order Completed"]) {
    // h4 roadmap ada 2 (desktop + mobile markup); cari yang visible
    const h4s = svc.locator(`h4:has-text("${s}")`);
    let vis = false;
    for (let i = 0; i < (await h4s.count()); i++) {
      if (await h4s.nth(i).isVisible()) { vis = true; break; }
    }
    if (!vis) roadmapOk = false;
  }
  r.push(["Roadmap 5 tahap", roadmapOk, true]);

  // 7. Order tracking input + search
  const trackInput = await page.locator('input[placeholder="Masukkan Order ID"]').isVisible().catch(()=>false);
  r.push(["Tracking input ada", trackInput, true]);
  await page.fill('input[placeholder="Masukkan Order ID"]', "CMMM-001");
  await page.click('button:has-text("Cari")');
  await page.waitForTimeout(300);
  const trackArea = await page.locator("text=Sistem tracking dinamis tersedia").isVisible().catch(()=>false);
  r.push(["Area status tracking muncul", trackArea, true]);

  // 8. Sertifikasi 4+ kartu
  const certs = await page.locator("text=Company Certifications").count();
  r.push(["Header Company Certifications", certs > 0, true]);
  for (const c of ["ISO 9001:2015","MSDS","COO / SKA","Fumigasi"]) {
    const v = await page.locator(`text=${c}`).first().isVisible().catch(()=>false);
    if (!v) r.push([`Cert ${c}`, false, true]);
  }
  // 9. ISO link new tab
  const isoLink = page.locator('a[href="/documents/ISO.pdf"]').first();
  const isoRel = await isoLink.getAttribute("rel");
  const isoTarget = await isoLink.getAttribute("target");
  r.push(["ISO.pdf link target=_blank", isoTarget === "_blank", true]);
  r.push(["ISO.pdf rel aman", isoRel === "noopener noreferrer", true]);

  // 10. Asset tidak broken (ISO.pdf 200)
  const isoStatus = await page.evaluate(async () => {
    const res = await fetch("/documents/ISO.pdf");
    return res.status;
  });
  r.push(["ISO.pdf tidak broken", isoStatus === 200, true]);

  console.log(`\n[VIEWPORT ${viewport.width}x${viewport.height}]`);
  const pass = r.every(([,a,e])=>a===e);
  r.forEach(([n,a,e]) => console.log(`${a===e?"✅":"❌"} ${n} (exp ${e}, got ${a})`));
  await page.context().close();
  return pass;
}
let all = true;
for (const v of [{width:393,height:852},{width:768,height:1024},{width:1280,height:800}]) {
  if (!(await run(browser, v))) all = false;
}
console.log("\n" + (all ? "✅ SEMUA PAS" : "❌ ADA GAGAL"));
await browser.close();
