const fs = require("fs");
const locs = ["id", "en", "ar", "zh", "de", "ru", "es"];
const msgs = {};
locs.forEach((L) => (msgs[L] = JSON.parse(fs.readFileSync(`messages/${L}.json`, "utf8"))));

function has(obj, key) {
  let o = obj;
  for (const s of String(key).split(".")) {
    if (o == null || o[s] === undefined) return false;
    o = o[s];
  }
  return true;
}

const files = [
  "app/components/product/product-order.tsx",
  "app/components/product/product-specs.tsx",
  "app/components/product/product-card.tsx",
  "app/components/inquiry/inquiry-form.tsx",
  "app/components/service/order-roadmap.tsx",
  "app/components/service/order-tracking.tsx",
  "app/components/service/certifications.tsx",
  "app/components/service/affiliate-flags.tsx",
  "app/components/inquiry/inquiry-section.tsx",
  "app/components/footer/legal-footer.tsx",
  "app/components/navbar/navbar.tsx",
  "app/login/page.tsx",
  "app/components/auth/buyer-registration-form.tsx",
  "app/components/auth/admin-login-form.tsx",
  "app/page.tsx",
];

// Var-name to hook index (t=0, to=1, tp=2...)
let issues = 0;
for (const path of files) {
  const src = fs.readFileSync(path, "utf8");
  const hooks = [...src.matchAll(/useTranslations\(\s*["']([^"']*)["']\s*\)/g)].map((m) => m[1] || "");

  // Find calls: t("..."), to("..."), tp("...") — capture var name + key
  const calls = [...src.matchAll(/\b(tp|to|t)\(\s*[`"']([^`"']+)[`"']/g)].map((m) => ({ v: m[1], k: m[2] }));

  for (const { v, k } of calls) {
    if (k.includes("${")) continue;
    const idx = v === "t" ? 0 : v === "to" ? 1 : 2;
    const ns = hooks[idx] !== undefined ? hooks[idx] : "";
    for (const L of locs) {
      const root = ns === "" ? msgs[L] : msgs[L][ns];
      if (!has(root ?? {}, k)) {
        console.log(`${L}  ${path.split("/").pop()}  MISSING ns="${ns}" key="${k}"`);
        issues++;
      }
    }
  }
}
console.log(issues === 0 ? "CLEAN — no missing keys" : issues + " issues");