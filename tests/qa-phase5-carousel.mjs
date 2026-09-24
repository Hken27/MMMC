import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });

async function runViewport(browser, viewport, label) {
  const page = await (await browser.newContext({ viewport })).newPage();
  const r = [];

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  // Scroll to #service
  await page.evaluate(() => document.getElementById("service").scrollIntoView());
  await page.waitForTimeout(1500); // Longer wait for component mount

  // === CAROUSEL STRUCTURE ===

  const certCarousel = page.locator('[aria-label*="Sertifikasi"]').first();
  const flagsCarousel = page.locator('[aria-label*="Negara afiliasi"]').first();

  const certExists = await certCarousel.count();
  const flagsExists = await flagsCarousel.count();

  r.push([`${label} | Certifications carousel found`, certExists > 0, true]);
  r.push([`${label} | AffiliateFlags carousel found`, flagsExists > 0, true]);

  if (certExists === 0 || flagsExists === 0) {
    await page.close();
    return r;
  }

  // Get animated tracks
  const certTrack = certCarousel.locator("div[style*='transform']").first();
  const flagsTrack = flagsCarousel.locator("div[style*='transform']").first();

  // === VERIFY TRACK ELEMENTS ===
  const certTrackExists = await certTrack.count();
  const flagsTrackExists = await flagsTrack.count();

  r.push([`${label} | Cert track with transform found`, certTrackExists > 0, true]);
  r.push([`${label} | Flags track with transform found`, flagsTrackExists > 0, true]);

  if (certTrackExists === 0 || flagsTrackExists === 0) {
    await page.close();
    return r;
  }

  // Wait for animation to truly start
  await page.waitForTimeout(500);

  // Capture initial transform values using evaluate directly on element
  const t0 = await page.evaluate(() => {
    const certT = document.querySelector('[aria-label*="Sertifikasi"] div[style*="transform"]');
    const flagsT = document.querySelector('[aria-label*="Negara afiliasi"] div[style*="transform"]');

    const extractX = (el) => {
      if (!el) return 0;
      const transform = window.getComputedStyle(el).transform;
      const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),/);
      return match ? parseFloat(match[1]) : 0;
    };

    return {
      cert: extractX(certT),
      flags: extractX(flagsT),
      certTransform: certT ? window.getComputedStyle(certT).transform : "none",
      flagsTransform: flagsT ? window.getComputedStyle(flagsT).transform : "none",
    };
  });

  r.push([`${label} | Initial cert X = ${Math.round(t0.cert)}`, true, true]);
  r.push([`${label} | Initial flags X = ${Math.round(t0.flags)}`, true, true]);

  // Wait longer for animation to progress significantly
  await page.waitForTimeout(4000);

  // Capture final transform values
  const t1 = await page.evaluate(() => {
    const certT = document.querySelector('[aria-label*="Sertifikasi"] div[style*="transform"]');
    const flagsT = document.querySelector('[aria-label*="Negara afiliasi"] div[style*="transform"]');

    const extractX = (el) => {
      if (!el) return 0;
      const transform = window.getComputedStyle(el).transform;
      const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),/);
      return match ? parseFloat(match[1]) : 0;
    };

    return {
      cert: extractX(certT),
      flags: extractX(flagsT),
    };
  });

  r.push([`${label} | Final cert X = ${Math.round(t1.cert)}`, true, true]);
  r.push([`${label} | Final flags X = ${Math.round(t1.flags)}`, true, true]);

  const certDelta = t1.cert - t0.cert;
  const flagsDelta = t1.flags - t0.flags;

  const certMovedRight = certDelta > 5;
  const flagsMovedLeft = flagsDelta < -5;
  const oppositeDirs = certMovedRight && flagsMovedLeft;

  r.push([`${label} | Certs RIGHT (Δ=${Math.round(certDelta)}px)`, certMovedRight, true]);
  r.push([`${label} | Flags LEFT (Δ=${Math.round(flagsDelta)}px)`, flagsMovedLeft, true]);
  r.push([`${label} | Opposite directions`, oppositeDirs, true]);

  // === NO BUTTONS ===
  const certButtonCount = await certCarousel.locator("button").count();
  const flagsButtonCount = await flagsCarousel.locator("button").count();

  r.push([`${label} | Certs no nav buttons`, certButtonCount === 0, true]);
  r.push([`${label} | Flags no nav buttons`, flagsButtonCount === 0, true]);

  // === NO HORIZONTAL OVERFLOW ===
  const bodyOverflow = await page.evaluate(() => {
    const w = window.innerWidth;
    const docW = document.documentElement.scrollWidth;
    return docW <= w + 1;
  });
  r.push([`${label} | No horizontal page overflow`, bodyOverflow, true]);

  // === DOCUMENTS OPEN SAFELY ===
  const isoLink = page.locator('a[href*="ISO.pdf"]').first();
  const isoTarget = await isoLink.getAttribute("target").catch(() => null);
  const isoRel = await isoLink.getAttribute("rel").catch(() => "");

  r.push([`${label} | ISO.pdf target="_blank"`, isoTarget === "_blank", true]);
  r.push([`${label} | ISO.pdf rel includes noopener`, isoRel?.includes("noopener") === true, true]);

  // === STRUCTURE ===
  const serviceVis = await page.locator("section#service").isVisible();
  r.push([`${label} | Service section visible`, serviceVis, true]);

  await page.close();
  return r;
}

// Test all 3 viewports
const results = [];
results.push(...(await runViewport(browser, { width: 390, height: 844 }, "📱 390")));
results.push(...(await runViewport(browser, { width: 768, height: 1024 }, "📊 768")));
results.push(...(await runViewport(browser, { width: 1440, height: 900 }, "🖥️ 1440")));

await browser.close();

// === PRINT RESULTS ===
console.log("\n" + "=".repeat(75));
console.log("QA PHASE 5 — CAROUSEL AUTO-SCROLL (Opposite Directions)");
console.log("=".repeat(75) + "\n");

let pass = 0,
  fail = 0;
results.forEach(([name, actual, expected]) => {
  const status = actual === expected ? "✅" : "❌";
  if (actual === expected) pass++;
  else fail++;
  console.log(`${status} ${name}`);
});

console.log("\n" + "=".repeat(75));
console.log(`TOTAL: ${pass} passed, ${fail} failed | ${pass + fail} tests`);
console.log("=".repeat(75) + "\n");

process.exit(fail > 0 ? 1 : 0);
