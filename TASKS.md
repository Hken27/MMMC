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


## [x] Phase 4: Globalization & Authentication (Dinamis) ✓ SELESAI
- [x] **Dev Agent & UI/UX**: Setup i18n localization framework (`next-intl`) dengan 2 bahasa utama: **Bahasa Indonesia (`id`) & English (`en`)**.

### 4.1 Role & Access Scope (RBAC) — FINAL
- [x] **Dev Agent**: Skema `users` dengan RBAC — kolom `role` enum `ADMIN`/`BUYER`.
- [x] **Dev Agent**: Akses server-side enforcement pada middleware & route handlers (buyer tidak dapat mengakses `/admin/*`).

### 4.2 Real OTP API Dispatch (Email)
- [x] **Dev & Security Agent**: Implementasi dan penyempurnaan sistem verifikasi email OTP real menggunakan Resend Free API pada app/lib/otp-sender.ts, terintegrasi dengan workflow registrasi dan aktivasi akun buyer. Spesifikasi Implementasi:
    1. Real Email Delivery
      - OTP harus dikirim secara real ke alamat email pengguna, termasuk Gmail (@gmail.com).
      - Gunakan Resend API melalui server-side TypeScript, bukan simulasi atau OTP yang hanya ditampilkan di console.
      - Sistem harus tetap dapat digunakan saat development lokal (localhost) tanpa harus menunggu deployment.
      - Gunakan Resend Free Tier tanpa mengharuskan pengguna berlangganan paket berbayar.
      - Periksa batasan domain pengirim Resend. Jika domain belum diverifikasi, berikan penanganan yang jelas tanpa mengklaim email berhasil dikirim.

    2. Professional Transactional Email Template
      - Buat template email HTML responsif dengan tampilan profesional, clean, corporate, dan konsisten dengan identitas perusahaan.
      - Subject: Verify Your Email Address — Account Activation.
      - Email harus mencakup:
          - Sapaan profesional.
          - Informasi bahwa pengguna sedang melakukan registrasi akun.
          - OTP 6 digit dengan tampilan yang jelas.
          - Masa berlaku OTP (10 menit).
          - Tombol atau link aktivasi akun jika diperlukan.
          - Informasi keamanan jika pengguna tidak merasa melakukan registrasi.
          - Company name dan signature Customer Support.
      - Sediakan fallback plain-text email.
      - Gunakan bahasa Inggris profesional sebagai default untuk buyer internasional.
    3. OTP Security
      - OTP dibuat secara cryptographically secure menggunakan crypto.randomInt atau mekanisme setara.
      - OTP berlaku selama 10 menit dan hanya dapat digunakan satu kali.
      - Terapkan rate limiting untuk pengiriman dan verifikasi OTP.
      - OTP tidak boleh disimpan dalam bentuk plaintext jika disimpan di database.
      - Jangan mengekspos OTP, API key, atau informasi sensitif ke client, console, maupun log produksi.
      - Gunakan generic error messages untuk menghindari email enumeration.
    4. Registration & Activation Workflow
      - Buyer mengisi email pada form registrasi.
      - Sistem mengirim OTP melalui Resend.
      - Buyer memasukkan OTP atau menggunakan secure activation link.
      - Backend memvalidasi OTP dan mengaktifkan akun hanya setelah verifikasi berhasil.
      - OTP yang expired, salah, atau sudah digunakan harus ditolak.
      - Sediakan mekanisme resend OTP dengan cooldown.
      - Pastikan status aktivasi akun diverifikasi secara server-side.
    5. Environment Configuration
      - Gunakan environment variables:
          - RESEND_API_KEY
          - EMAIL_FROM
          - APP_URL
      - Jangan hardcode API key atau alamat email pengirim.
      - Pastikan .env.local masuk .gitignore.
      - Dokumentasikan konfigurasi development lokal dan production.
      - Gunakan domain pengirim terverifikasi untuk production serta konfigurasi SPF, DKIM, dan DMARC guna meningkatkan email deliverability.
    6. Security & QA Agent
      - Audit endpoint pengiriman dan verifikasi OTP.
      - Pastikan buyer tidak dapat melewati verifikasi email dengan memanipulasi client-side state.
      - Test pengiriman email real, OTP valid, OTP invalid, expired OTP, resend cooldown, rate limiting, dan aktivasi akun.
      - Pastikan build, lint, dan TypeScript clean.
      - Jangan mengubah desain existing atau komponen lain di luar scope task tanpa instruksi eksplisit.
    **Acceptance Criteria:**
      - OTP berhasil dikirim ke Gmail pengguna melalui Resend API.
      - Email berisi OTP dan template profesional.
      - Sistem berfungsi pada development lokal.
      - Akun buyer tidak dapat aktif sebelum OTP berhasil diverifikasi.
      - Tidak ada placeholder, mock delivery, atau bypass verifikasi di production.
      - Implementasi menggunakan Resend Free Tier tanpa kewajiban berlangganan berbayar.
      - Seluruh perubahan mengikuti CLAUDE.md, CURSORRULES.md, ARCHITECTURE.md, dan TASKS.md.

### 4.3 2-Step Buyer Registration Workflow
- [x] **UI/UX & Dev Agent**: Alur pendaftaran buyer dibagi menjadi 2 tahap terstruktur:
  - **Langkah 1**: Input nama dan email, lalu kirim & verifikasi OTP real via Email terlebih dahulu.
  - **Langkah 2**: Setelah OTP terverifikasi, lanjutkan pengisian sektor bisnis, cascading alamat internasional (Negara → Provinsi/State → Kota/City → Distrik), dan kata sandi akun.

### 4.4 Cascading International Address Dropdown
- [x] **UI/UX Agent**: Menu turunan wilayah domestik dan internasional (Singapura, Malaysia, Amerika Serikat, China, Jepang, UEA, Arab Saudi) yang saling terhubung secara dinamis.

### 4.5 Dual Login Support (Username / Email)
- [x] **Dev Agent**: Autentikasi NextAuth mendukung login menggunakan **Username** ataupun **Email**, lengkap dengan penanganan error yang bersih dan akun uji (`wahyu` / `12341234`).

### 4.6 Custom Popup Modal Alert
- [x] **UI/UX Agent**: Seluruh notifikasi sukses/gagal auth menggunakan komponen `PopupModal` (Shadcn UI + Tailwind CSS) sesuai Core Tech Stack.

### 4.7 Sistem Kabisat (Leap Year) & Utilities
- [x] **Dev Agent**: Utility kalkulasi tahun kabisat `isLeapYear` dan `getDaysInMonth` di `app/lib/leap-year.ts`.

### 4.8 Logged-in Buyer Inquiry Submission & Hydration Safety
- [x] **Dev & UI/UX Agent**: 
  - [x] Buyer yang sudah login dapat langsung mengirim inquiry yang tersimpan otomatis ke database PostgreSQL (`/api/inquiry/submit`).
  - [x] Perbaikan hydration mismatch pada formulir inquiry (`InquiryForm`) dengan `mounted` check client-side rendering.
  - [x] Perbaikan redirect login berdasarkan role (`ADMIN` → `/admin`, `BUYER` → `/`).

### 4.9 Session-Aware Navigation & Profile Dropdown
- [x] **Dev & UI/UX Agent**: Perbaikan routing navigasi untuk seamless user experience post-authentication.
  - [x] **NavbarClient**: Menampilkan profile dropdown (user name/email + logout button + admin dashboard link) saat authenticated; tombol login hilang.
  - [x] **NavbarMobileMenu**: Integrasi session awareness di mobile drawer — tampil logout dan dashboard admin link untuk role ADMIN.
  - [x] **Session Loading State**: Skeleton placeholder di desktop nav saat session status loading.
  - [x] **CallbackUrl Redirect**: AdminLoginForm respects `callbackUrl` query param dari middleware, redirect post-login ke halaman asal (e.g., `/admin` jika diblokir akses tanpa login).
  - [x] **Profile Menu State Management**: Close profile dropdown saat mobile drawer membuka (mencegah overlap).
  - [x] **Username Display**: Navbar menampilkan username (bukan email) saat buyer/admin login, dengan fallback ke name/email jika tidak ada.

### 4.10 Order Configuration Auto-Fill di Inquiry Form
- [x] **Dev & UI/UX Agent**: Integrasi seamless antara ProductOrder calculator dan InquiryForm — order config otomatis mengisi form.
  - [x] **ProductOrder Handler**: Klik "Kirim Inquiry Sekarang" → simpan konfigurasi (produk, qty, MOQ, packaging, shipping, subtotal) ke sessionStorage + dispatch custom event `orderConfigUpdated` + scroll ke form.
  - [x] **InquiryForm Event Listener**: Listen custom event → re-read sessionStorage → update state orderConfig.
  - [x] **Auto-Fill Fields**: Form auto-fill dari session (nama lengkap, email) + dari orderConfig (produk, qty). Buyer tinggal input perusahaan + pesan.
  - [x] **Form State Management**: State-controlled inputs (bukan defaultValue) untuk ensure UI sync dengan state data.
  - [x] **Order Config Alert**: Tampilkan summary card di atas form saat orderConfig terdeteksi (produk, qty, subtotal).
  - [x] **API Enhancement**: `/api/inquiry/submit` terima orderConfig → simpan lengkap ke message field inquiry di database.
  - [x] **Post-Submit Cleanup**: Clear sessionStorage + reset form setelah sukses submit.

### 4.11 Social Login & Global Hierarchical Address Management
- [x] **Dev & Security Agent**: Implementasi Social Login mendukung OAuth 2.0 authentication dengan provider Google dan Apple.
  - [x] **1. OAuth 2.0 Integration** — NextAuth + Google/Apple providers, environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APPLE_CLIENT_ID, APPLE_CLIENT_SECRET, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY)
  - [x] **2. UI/UX — Sign In/Sign Up Buttons** — Minimalist modern design dengan official brand icons (Google + Apple SVG inline), responsive button styling (Shadcn UI + Charcoal/Emerald palette)
  - [x] **3. Account Linking** — OAuth provider account auto-creation, `socialProvider` column (GOOGLE/APPLE), `oauthId` storage
  - [x] **4. Email Verification** — Social login bypass OTP (provider verified) → direct to Step 2, email/password still require OTP
  - [x] **5. Profile Auto-Fill** — OAuth user info (name, email, avatar) auto-fill registration form
  - [x] **6. Session & RBAC** — Social login tunduk RBAC, session behavior sama dengan email/password
  - [x] **7. Error Handling & Security** — Generic error messages, encrypted oauth_id storage, fallback ke email/password
  - [x] **8. UI Placement** — Social login buttons ditampilkan di **Login Page** (AdminLoginForm), bukan di Registration Page — untuk universal akses (buyer + admin bisa login via OAuth)
  - [x] **9. Environment Configuration (CRITICAL)** — Setup Google OAuth + Apple OAuth credentials di `.env.local` WAJIB:
    - Google: https://console.cloud.google.com → Create Project → Credentials → OAuth 2.0 Client IDs (Web) → Authorized origins: `http://localhost:3000` → Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
    - Apple: https://developer.apple.com/account → Certificates, Identifiers & Profiles → Create Service ID untuk auth
    - Tanpa setup credentials di env.local → Error 401: invalid_client (OAuth provider tidak terkenali)
    - **Acceptance Criteria**: Credentials tercopy ke `.env.local`, dev server restart, social buttons clickable, redirect ke provider consent screen success, account creation + session working
  - [x] **10. QA & Acceptance Criteria** — Social buttons visible di login page, redirect ke provider, session created, build/lint clean

- [x] **UI/UX & Dev Agent**: Evolusi dari Cascading International Address Dropdown (4.4) → Global Hierarchical Address Management (PlaceDB).
  - [x] **1. Address Hierarchy Levels** — Country → State/Province → City/Regency → District/Subdistrict → Postal Code (5 levels)
  - [x] **2. Data Source — PlaceDB** — Primary: PlaceDB REST API (https://api.placedb.org/v1/) + PostgreSQL caching
    - [x] 255+ negara/wilayah (Countries & Territories)
    - [x] 4.316+ pembagian administratif (Administrative Divisions)
    - [x] 1.697.155+ settlements (Cities, Towns & Populated Places)
    - [x] CC0 (Public Domain) license — gratis, tanpa API key
    - [x] ISO 3166 country codes + ISO 3166-2 administrative division codes
  - [x] **3. Cascading Logic & UI** — Dynamic dropdown population on selection, skip missing levels, responsive (desktop inline / tablet mobile stacked)
  - [x] **4. Regional Variations** — Handle countries dengan different detail levels
  - [x] **5. Database Schema Enhancement** — Prisma tables: Country, State, City, District, PostalCode dengan hierarchical relations + User model address fields
  - [x] **6. API Endpoint — Address Data Fetch** — `/api/geo/countries`, `/api/geo/states?country=US`, `/api/geo/cities?country=US&state=CA`, `/api/geo/districts?country=ID&state=JK&city=Jakarta` dengan caching TTL 24 jam
  - [x] **7. Caching Strategy** — First fetch dari PlaceDB API, stored ke PostgreSQL, subsequent requests served dari cache (tidak bergantung API eksternal per request)
  - [x] **8. Integration dengan Registration Form** — Step 2 address section menggunakan HierarchicalAddressSelect component, user select all required levels sebelum submit
  - [x] **9. QA & Acceptance Criteria** — Country dropdown render 255+ negara, cascade correct per selection, empty state handling, API caching working (24h TTL), form validation enforced, responsive 3 viewport, fallback to cache when API fails, build/lint clean, Phase 4 regression pass

**Implementation Files Created/Updated:**
- `prisma/schema.prisma` — Geographic tables (Country, State, City, District, PostalCode) + User address fields
- `prisma/migrations/add_geographic_tables/migration.sql` — Database migration
- `prisma/seed.ts` — Seed script (Indonesia, USA, Singapore data)
- `app/lib/prisma.ts` — Prisma client singleton
- `app/lib/geo-api.ts` — Global hierarchical address service (PlaceDB API + PostgreSQL cache)
- `app/api/geo/countries/route.ts` — Level 1 endpoint
- `app/api/geo/states/route.ts` — Level 2 endpoint
- `app/api/geo/cities/route.ts` — Level 3 endpoint
- `app/api/geo/districts/route.ts` — Level 4 endpoint
- `app/lib/auth.ts` — NextAuth config dengan Google + Apple OAuth providers
- `app/components/auth/social-login-button.tsx` — Premium social login buttons
- `app/components/auth/hierarchical-address-select.tsx` — Global hierarchical address cascade component
- `app/components/auth/admin-login-form.tsx` — Updated: integrate social login buttons (Login Page placement)
- `app/components/auth/buyer-registration-form.tsx` — Updated: integrate hierarchical address selector
- `package.json` — Updated seed command untuk ts-node

**Cascade Flow Verification:**
- [x] Select country → loads states dari PlaceDB API → cached ke PostgreSQL
- [x] Select state → loads cities dari PlaceDB API → cached ke PostgreSQL
- [x] Select city → loads districts dari PostgreSQL (if available)
- [x] All dropdowns fully functional, sorted A-Z
- [x] Summary card displays selected address
- [x] Form auto-fills buyer registration data

## [ ] Phase 5: Admin Dashboard (ERP) — Next Progress (belum final, placeholder scope)
- [ ] **UI/UX Agent**: Desain dashboard admin terpisah dari Public Site (lihat pengecualian DESIGN LOCK di atas). Detail visual/desain akan ditentukan user saat phase ini dimulai — jangan berasumsi.
- [ ] **Dev Agent**: Modul ERP awal (scope akan dirinci lebih lanjut oleh user): manajemen Order (lihat/ubah status → menyambung ke Order Tracking buyer di Phase 3), manajemen Produk/Katalog, manajemen Inquiry masuk.
- [ ] **Security Agent**: Audit trail aksi admin (siapa mengubah apa, kapan) — penting karena ini sistem operasional (ERP), bukan sekadar CMS.
- [ ] **QA Agent**: Pastikan tidak ada kebocoran akses — buyer tidak bisa reach halaman/API admin manapun walau tahu URL-nya (termasuk halaman placeholder "Coming Soon" di §4.1).