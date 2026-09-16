# Project Roadmap & Task Tracking

## [ ] Phase 1: Foundation, Navigation & Security Hardening (CURRENT FOCUS)
- [ ] **Dev Agent**: Setup Next.js App Router dengan proteksi Content Security Policy (CSP) awal di `next.config.js`. <!-- @backend -->
- [x] **UI/UX Agent**: Design responsive Navbar layout utilizing Shadcn UI & Motion (React Bits) animation. <!-- @ui-ux --> (Selesai: Charcoal #0B0F19 bg, Emerald accent, hamburger slide-in drawer, SSR-visible, zero lint errors)
- [x] **Security Agent**: Jalankan audit dependensi perdana (`npm audit`), kunci file lock, dan pastikan tidak ada pustaka luar yang rentan (*vulnerable dependencies*). <!-- @security --> (Selesai: 3 kerentanan ditutup → `npm audit` = 0 vulnerabilities, next→16.3.5)
- [ ] **QA Agent**: Test hamburger menu responsiveness on iOS/Android devices and verify zero broken links. <!-- @qa -->

## [ ] Phase 2: Catalog (Produk) & Inquiry System (Statis & Form)
- [ ] **UI/UX & Dev**: Build Product specs grid and the dynamic Inquiry/Contact form.
- [ ] **Security Agent**: Audit Form Kontak terhadap serangan spam (Honeypot/reCAPTCHA) dan injeksi skrip. <!-- @security -->

## [ ] Phase 3: Globalization & Authentication (Dinamis)
- [ ] **Dev Agent**: Setup i18n localization framework dan konfigurasi skema PostgreSQL.
- [ ] **Security Agent**: Audit mendalam terhadap enkripsi hashing password dan mekanisme proteksi session pembeli internasional. <!-- @security -->
-