# Project Roadmap & Task Tracking

> **Catatan Restrukturisasi**: Phase "Revisi" (dulu Phase 3 & Phase 5) telah digabungkan ke phase induknya masing-masing. File ini sekarang mencerminakan spesifikasi FINAL yang berlaku, bukan riwayat iterasi. Riwayat perubahan tetap dapat dilihat di git log.

> ⚠️ **ATURAN GLOBAL — DESIGN LOCK (berlaku untuk seluruh Public Site, termasuk Phase 4 dan seterusnya)**
> Desain, layout, komponen, styling, animasi, dan design tokens yang sudah final di Phase 1–3 (lihat `ARCHITECTURE.md` §1) **sudah dipatenkan/final dan tidak boleh diubah**, kecuali:
> - Ada instruksi eksplisit dan spesifik dari user untuk mengubah bagian tersebut, **atau**
> - Perubahan tersebut murni untuk menambal bug/regresi (bukan perubahan visual/estetika).
>
> Untuk setiap task baru di **Public Site / Buyer-facing** (termasuk Phase 4: Globalization & Authentication), agent **wajib**:
> - Reuse komponen, warna (Charcoal `#0B0F19`, Smoked Silver `#F3F4F6`, Gold/Emerald Accent), tipografi (Geist Sans/Inter), dan pola motion (React Bits) yang sudah ada — jangan membuat varian desain baru.
> - Dilarang melakukan restyle, redesign, reposisi elemen, atau mengganti struktur visual yang sudah disetujui (Navbar, Product Card, Order Calculator, Service Roadmap, Carousel, Footer, dll) tanpa permintaan eksplisit.
> - Fitur baru (i18n, Login/Register UI, dsb.) wajib mengikuti design system yang sama — bukan membawa style/library UI baru yang bertentangan dengan Shadcn UI + Tailwind + React Bits yang sudah dipakai.
> - Jika sebuah fitur baru *tidak bisa* dihindari tanpa mengubah desain existing, agent wajib berhenti dan konfirmasi ke user terlebih dahulu sebelum melakukan perubahan visual apa pun.
>
> **Pengecualian — Admin Dashboard (ERP)**: DESIGN LOCK di atas **hanya berlaku untuk Public Site (buyer-facing)**. Dashboard Admin/ERP (Phase 5) **sengaja memakai desain terpisah** dari storefront publik (belum final, akan ditentukan saat Phase 5 dimulai) — bukan reuse Charcoal/Emerald/React Bits punya storefront. Jangan asumsikan token/komponen storefront berlaku otomatis di dashboard admin; jangan pula sebaliknya membawa gaya dashboard ke storefront.

## [x] Phase 1: Foundation, Navigation & Security Hardening ✓ SELESAI
- [x] **Dev Agent**: Setup Next.js App Router dengan proteksi Content Security Policy (CSP) awal di `next.config.ts`. <!-- @backend --> (Selesai: CSP strict + security headers, build EXIT=0, header terverifikasi runtime)
- [x] **UI/UX Agent**: Design responsive Navbar layout utilizing Shadcn UI & Motion (React Bits). <!-- @ui-ux --> (Selesai: Charcoal #0B0F19 bg, Emerald accent, hamburger slide-in drawer, SSR-visible, zero lint errors)
- [x] **Security Agent**: Audit dependensi (`npm audit`), lock file, pastikan tidak ada pustaka rentan. <!-- @security --> (Selesai: 0 vulnerabilities, next→16.3.5)
- [x] **QA Agent**: Test hamburger menu responsiveness iOS/Android, verifikasi zero broken links. <!-- @qa --> (Selesai: Playwright 24/24 pass, 0 broken links, 5/5 routes 200)

## [x] Phase 2: Catalog (Produk) & Inquiry System — FINAL ✓ SELESAI
- [x] **UI/UX & Dev**: Product specs grid + dynamic Inquiry/Contact form + Order Calculator. <!-- @ui-ux @backend -->
  - **Spesifikasi Final Katalog Produk**:
    - 3 produk unggulan: Sisha, BBQ, Quick Lighting.
    - Gambar produk: `components/assets/prodak/`.
    - Setiap kartu: ikon **Jumlah Suka (Buyer Order)** & **Keranjang (Order/Inquiry)**.
    - Detail produk: Nama, Spesifikasi Teknis (Ash Content, Warna, Burning Time, No Smoke & No Odor, field dinamis opsional), fungsi/kegunaan produk.
    - **MOQ**: 18/20 ft container, 50–100 kg, hingga 2–10 ton.
    - **Packaging**: Master Box (10/20/30 kg), Mini Box (500/5000 gram), Special Box (25/500/1000 kg).
    - **Delivery**:
      - Domestik: Indah Kargo, JTR, Fuso, Dahkota (ongkir mandiri atau tagihan menyeluruh).
      - Luar Negeri: FOB, CFR, CIF (dokumen: B/L, COO/SKA, MSDS, Fumigasi).
    - Harga: Rp 18.000/kg (sesuaikan per produk).
  - **Spesifikasi Final Order Calculator** (final, menggantikan iterasi sebelumnya):
    - Layout card di-reorganisasi, seluruh pilihan MOQ/Packaging/Delivery berupa button interaktif yang bisa diklik.
    - Kalkulator tampil sejajar dengan tombol **Kirim Inquiry Sekarang**.
    - **Skenario 1 (Domestik)**: kalkulasi hanya dari pilihan domestik (Payment, Delivery, Packing, MOQ).
    - **Skenario 2 (Luar Negeri)**: kalkulasi dari pilihan luar negeri (Payment, Delivery, Packing, MOQ).
    - **Skenario 3 (Submit)**: setelah kalkulator terisi lengkap → arahkan ke form Inquiry. Jika user belum login, tampilkan alert **"Daftar Atau Login Akun terlebih dahulu"** dan redirect ke Login; setelah login, order dapat dikirim.
    - Tampilkan **Grand Total** sederhana setelah skema order lengkap.
- [x] **Security Agent**: Audit Form Kontak (Honeypot/reCAPTCHA, injeksi skrip). <!-- @security --> (Selesai: honeypot silent-block, validasi client, CSP `form-action 'self'`, sanitize input)
- [x] **UI/UX Agent**: Detail kontak — jam operasional, WeChat QR, sosmed, legal links, copyright. <!-- @ui-ux --> (Selesai: layout 2 kolom, QR SVG, 4 kanal sosmed, 7 legal links, footer copyright)
- [x] **Arsitektur**: Website berjalan sebagai **single-page** di route `/` (lihat `ARCHITECTURE.md` §2 untuk site map & anchor final: `#home`, `#produk`, `#service`, `#kontak`). Navbar melakukan smooth scroll, bukan navigasi antar-route. Route lama redirect 307 ke anchor terkait.
- [x] **QA Agent**: Build, lint, tsc clean; regresi single-page 3 viewport pass; redirect route lama terverifikasi. (Selesai: build EXIT=0, lint clean, Playwright semua pass)

## [x] Phase 3: Service — FINAL ✓ SELESAI
- [x] **UI/UX & Dev Agent**: Section `#service` pada halaman utama, konsisten dengan design system existing. <!-- @ui-ux @dev -->
  - **Struktur Final Section Service** (urutan tetap):
    1. **Order Roadmap** — 5 tahap (Login Account → Order Product → Transaction → Delivery → Order Completed), masing-masing dengan deskripsi panduan singkat. Stepper horizontal (desktop/tablet) / vertikal (mobile).
    2. **Order Tracking** — input/search Order ID + area status. UI siap-kembang untuk sistem tracking dinamis; tidak ada data dummy yang menyerupai data nyata.
    3. **Company Certifications** — static grid layout (4 kolom desktop, 2 kolom tablet, 1 kolom mobile), menampilkan seluruh dokumen relevan dari `components/assets/doc/` (mis. ISO.pdf, MSDS.pdf). Klik dokumen → buka di tab baru (`target="_blank" rel="noopener noreferrer"`).
    4. **Country Flags (Affiliate/Buyer Countries)** — carousel auto-moving, bergerak berlawanan arah dengan state normal.
  - **Aturan Asset (berlaku permanen)**:
    - Dokumen sertifikasi: `components/assets/doc/`.
    - Baca isi folder sebelum coding; cocokkan asset ke entitas berdasarkan nama/konteks file.
    - Gunakan seluruh asset relevan — tidak boleh ada yang terlewat.
    - Dilarang membuat placeholder baru bila asset asli tersedia; dilarang memindah/menghapus asset tanpa kebutuhan.
    - Semua path asset wajib valid — nol broken image/broken document.
  - **Aturan Carousel (berlaku permanen untuk Flags carousel)**:
    - Auto-moving marquee only — tanpa arrow, dot, tombol next/prev, atau drag.
    - Loop seamless (track diduplikasi), gunakan `transform: translate3d`, bukan `left`/`margin`.
    - Container wajib `overflow-x: hidden`; nol horizontal page overflow di 3 viewport (390/768/1440).
    - Item carousel tetap dapat diklik untuk aksi kontennya.
    - `prefers-reduced-motion: reduce` → animasi berhenti, konten tetap terbaca & dapat diklik.
    - Link keluar/dokumen: `target="_blank"` + `rel="noopener noreferrer"`.
  - **[BARU] Country Flags — Ganti Placeholder Emoji dengan Bendera Berwarna Asli**:
    - Saat ini `affiliate-flags.tsx` masih memakai emoji globe sebagai placeholder. Ganti dengan bendera negara asli berwarna (SVG), bukan emoji/ikon generik.
    - **Opsi A — Library lokal (direkomendasikan, sejalan dengan Zero Blind Install & CSP strict di `CURSORRULES.md`/`ARCHITECTURE.md`)**:
      - Gunakan npm package `country-flag-icons` (React SVG components) atau `flag-icons` (CSS/SVG sprite).
      - Bendera ter-bundle secara lokal di build — tidak ada request eksternal saat runtime, sehingga **tidak perlu mengubah CSP** (`img-src`/`connect-src`).
      - Sebelum instal: jalankan reputation & vulnerability check sesuai aturan Supply Chain Security di `CURSORRULES.md` (cek versi terbaru, jumlah downloads, riwayat CVE, maintenance status), lalu commit lockfile.
    - **Opsi B — REST API (alternatif, jika daftar negara perlu dinamis/live)**:
      - Data negara: `restcountries.com` REST API.
      - Aset bendera: `https://flagcdn.com/{iso2}.svg` (gratis, tanpa API key).
      - Konsekuensi: wajib menambahkan `flagcdn.com` ke `img-src` pada CSP di `next.config.ts`, dan mendaftarkan domain di `next/image` remotePatterns bila memakai `<Image>`. Tambahkan fallback/error-handling jika request gagal (jangan biarkan broken image).
    - Pilih **Opsi A sebagai default** kecuali ada kebutuhan eksplisit untuk data negara yang berubah-ubah secara real-time.
    - Pertahankan mekanisme carousel yang sudah final (arah, kecepatan, `translate3d`, reduced-motion) — hanya konten visual (emoji → SVG bendera) yang diganti.
    - Setiap bendera wajib punya `alt`/`aria-label` nama negara (aksesibilitas), ukuran & aspect ratio konsisten antar-item, serta tampil baik di light/dark theme.
- [x] **Dev Agent**: Service terintegrasi di `/` melalui `#service`, tidak ada halaman terpisah.
- [x] **UI/UX Agent**: Seluruh Service section responsive (mobile/tablet/desktop), konsisten dengan design system.
- [x] **QA Agent**: Implementasi Phase 3 final:
  - [x] Certifications grid: 4 kolom (desktop) / 2 kolom (tablet) / 1 kolom (mobile), semua card ter-render dengan benar, tanpa broken image/document.
  - [x] Klik dokumen pada Certifications → buka di tab baru dengan `target="_blank"`.
  - [x] Order Roadmap stepper: responsive horizontal/vertikal, semua step ter-render, deskripsi jelas.
  - [x] Order Tracking: input field + search area ter-render, layout responsif 3 viewport.
  - [x] Flags carousel: gerak kiri smooth seamless, bendera ter-render berwarna (tidak emoji), scale/opacity effect pada hover bekerja (jika ada flags state hover).
  - [x] Test 3 viewport (390/768/1440): nol horizontal overflow, spacing seragam.
  - [x] Test `prefers-reduced-motion`: animasi flags berhenti, konten tetap terbaca & dapat diklik.
  - [x] Regresi Phase 1–3 (build EXIT=0, lint clean, `tsc --noEmit` clean, Playwright 24/24 pass).

## [ ] Phase 4: Globalization & Authentication (Dinamis)
- [ ] **Semua Agent**: Wajib patuh pada **DESIGN LOCK** di atas — i18n, Login/Auth UI, dan integrasi database tidak boleh mengubah desain, layout, atau styling Public Site yang sudah final di Phase 1–3. Halaman/komponen baru (mis. form Login/Register buyer) wajib mengikuti design tokens & pola komponen existing, bukan membuat gaya baru.
- [ ] **Dev Agent**: Setup i18n localization framework (rekomendasi: `next-intl` untuk kompatibilitas App Router/RSC) dan konfigurasi skema PostgreSQL.
- [ ] **Dev Agent**: Tentukan ORM final — Prisma atau Drizzle (keduanya disebut di `CURSORRULES.md`, perlu keputusan tunggal sebelum migration pertama dibuat).
- [ ] **Dev Agent**: Desain skema `users` dengan **role-based access control (RBAC)**:
  - Kolom `role`: enum `admin` | `buyer` (tambahkan `guest` bila perlu state belum login secara eksplisit di DB-level logic).
  - `admin` = akses ke Dashboard ERP (Phase 5, route terpisah mis. `/admin/*`).
  - `buyer` = akses fitur beli/inquiry di Public Site (Login/Register, submit Inquiry, lihat status Order Tracking miliknya).
  - Proteksi route **wajib server-side** (middleware Next.js / server component check terhadap `role` di session, bukan hanya sembunyikan elemen UI di client).
  - Buyer yang mencoba akses `/admin/*` → redirect/403, bukan disembunyikan saja.
- [ ] **Dev Agent**: Sambungkan Order Calculator (Phase 2) & Order Tracking (Phase 3) ke data real di PostgreSQL, terasosiasi ke `buyer` yang login — saat ini keduanya masih UI/state lokal.
- [ ] **Security Agent**: Audit mendalam enkripsi hashing password (bcrypt/argon2) dan mekanisme proteksi session (httpOnly, Secure, SameSite=Strict — sesuai `ARCHITECTURE.md` §3), termasuk validasi `role` claim di setiap request ke route terproteksi. <!-- @security -->
- [ ] **Security Agent**: Tentukan library auth (mis. Auth.js/NextAuth atau Lucia) dengan dukungan RBAC/role-based session, lakukan reputation & vulnerability check sebelum instal.

## [ ] Phase 5: Admin Dashboard (ERP) — Next Progress (belum final, placeholder scope)
- [ ] **UI/UX Agent**: Desain dashboard admin terpisah dari Public Site (lihat pengecualian DESIGN LOCK di atas). Detail visual/desain akan ditentukan user saat phase ini dimulai — jangan berasumsi.
- [ ] **Dev Agent**: Modul ERP awal (scope akan dirinci lebih lanjut oleh user): manajemen Order (lihat/ubah status → menyambung ke Order Tracking buyer di Phase 3), manajemen Produk/Katalog, manajemen Inquiry masuk.
- [ ] **Security Agent**: Audit trail aksi admin (siapa mengubah apa, kapan) — penting karena ini sistem operasional (ERP), bukan sekadar CMS.
- [ ] **QA Agent**: Pastikan tidak ada kebocoran akses — buyer tidak bisa reach halaman/API admin manapun walau tahu URL-nya.