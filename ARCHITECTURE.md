# System Architecture & Design Tokens

## 1. Visual & Branding Design Tokens
- Theme: Professional, Clean, Premium Industrial.
- Colors: Charcoal Obsidian (`#0B0F19`), Smoked Silver (`#F3F4F6`), Gold/Emerald Accent.
- Typography: Geist Sans (Headings), Inter (Body).
- Micro-interactions: Integration of React Bits.

## 2. Navigation & Site Map
- **Home**, **Produk**, **Service**, **Kontak**, **Language**, **Login**.

## 3. Security, Hardening & Compliance Architecture
- **Dependency Guard**: Pemindaian otomatis menggunakan `npm audit` / Snyk di setiap alur kerja CI/CD sebelum kode diproduksi.
- **Content Security Policy (CSP)**: Konfigurasi CSP strict pada `next.config.js` untuk membatasi eksekusi skrip JavaScript hanya dari domain tepercaya (menghalau injeksi malware XSS).
- **Environment Isolation**: Kredensial DB PostgreSQL dan API Keys wajib menggunakan variabel lingkungan (`.env.local`) yang terdaftar di `.gitignore`.
- **Session Protection**: Token login wajib disimpan dalam Cookie berstatus `httpOnly`, `Secure`, dan `SameSite=Strict`.
-