# System Architecture & Design Tokens

## 1. Visual & Branding Design Tokens (Public Site)
- Theme: Professional, Clean, Premium Industrial.
- Colors: Charcoal Obsidian (`#0B0F19`), Smoked Silver (`#F3F4F6`), Gold/Emerald Accent.
- Typography: Geist Sans (Headings), Inter (Body).
- Micro-interactions: Integration of React Bits.
- **Scope**: Token di atas berlaku untuk **Public Site (buyer-facing)** saja — lihat `TASKS.md` (DESIGN LOCK). Dashboard Admin/ERP memakai design system terpisah (lihat §4), belum final, akan ditentukan saat Phase 5 dimulai.

## 2. Navigation & Site Map

### 2.1 Public Site (Buyer-facing) — single-page, route `/`
- Section (anchor, smooth scroll): `#home`, `#produk`, `#service`, `#kontak`.
- Global nav item lain: **Language**, **Login/Register** (buyer).
- Route lama (`/produk`, `/service`, `/kontak`) redirect 307 ke anchor terkait.

### 2.2 Admin Dashboard (ERP) — route terpisah, next progress (Phase 5)
- Route terpisah dari Public Site, mis. `/admin/*` (bukan section/anchor di `/`).
- Hanya dapat diakses oleh user dengan `role = admin`.
- Struktur menu & modul (Order management, Katalog, Inquiry masuk, dsb.) akan dirinci lebih lanjut saat Phase 5.

## 3. Roles & Access Control
- **Role model**: `admin` dan `buyer` (lihat detail skema di `TASKS.md` Phase 4).
  - `buyer`: dapat login/register, submit Inquiry, memakai Order Calculator, melihat Order Tracking miliknya sendiri di Public Site.
  - `admin`: beroperasi di Admin Dashboard (kebutuhan ERP) — mengelola Order, Katalog, Inquiry masuk, dan (nanti) melihat/mengubah status yang muncul di Order Tracking buyer.
- **Server-side enforcement wajib**: proteksi akses berbasis role dilakukan di middleware/server component, bukan hanya menyembunyikan elemen UI di client. Buyer yang mengakses route admin harus mendapat redirect/403 di level server.
- **Session/role claim**: token sesi (lihat §5 Session Protection) wajib membawa `role`, divalidasi ulang di setiap request ke route/API yang diproteksi — jangan percaya role dari state client semata.

## 4. Security, Hardening & Compliance Architecture
- **Dependency Guard**: Pemindaian otomatis menggunakan `npm audit` / Snyk di setiap alur kerja CI/CD sebelum kode diproduksi.
- **Content Security Policy (CSP)**: Konfigurasi CSP strict pada `next.config.js` untuk membatasi eksekusi skrip JavaScript hanya dari domain tepercaya (menghalau injeksi malware XSS).
- **Environment Isolation**: Kredensial DB PostgreSQL dan API Keys wajib menggunakan variabel lingkungan (`.env.local`) yang terdaftar di `.gitignore`.
- **Session Protection**: Token login wajib disimpan dalam Cookie berstatus `httpOnly`, `Secure`, dan `SameSite=Strict`.
- **Access Control (RBAC)**: Lihat §3 — proteksi role wajib server-side, tidak boleh mengandalkan sembunyi-elemen di client saja.
- **Audit Trail (Admin/ERP)**: Setiap aksi admin di Dashboard ERP (Phase 5) harus tercatat (siapa, aksi apa, kapan) — bukan sekadar CMS tanpa histori.