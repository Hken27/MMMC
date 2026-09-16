# Project Roadmap & Task Tracking

## [ ] Phase 1: Foundation, Navigation & Security Hardening (CURRENT FOCUS)
- [x] **Dev Agent**: Setup Next.js App Router dengan proteksi Content Security Policy (CSP) awal di `next.config.ts`. <!-- @backend --> (Selesai: CSP strict + security headers, build EXIT=0, header terverifikasi runtime)
- [x] **UI/UX Agent**: Design responsive Navbar layout utilizing Shadcn UI & Motion (React Bits) animation. <!-- @ui-ux --> (Selesai: Charcoal #0B0F19 bg, Emerald accent, hamburger slide-in drawer, SSR-visible, zero lint errors)
- [x] **Security Agent**: Jalankan audit dependensi perdana (`npm audit`), kunci file lock, dan pastikan tidak ada pustaka luar yang rentan (*vulnerable dependencies*). <!-- @security --> (Selesai: 3 kerentanan ditutup → `npm audit` = 0 vulnerabilities, next→16.3.5)
- [x] **QA Agent**: Test hamburger menu responsiveness on iOS/Android devices and verify zero broken links. <!-- @qa --> (Selesai: Playwright pass 24/24 di iPhone/Android/tablet/desktop; 0 broken links, 5/5 routes 200)

## [x] Phase 2: Catalog (Produk) & Inquiry System (Statis & Form) ✓ SELESAI
- [x] **UI/UX & Dev**: Build Product specs grid and the dynamic Inquiry/Contact form. <!-- @ui-ux @backend --> (Selesai: product grid 3 kartu, specs, MOQ/packaging/delivery, harga/kg, kartu icon buyer order + inquiry; form honeypot silent-block, validasi, animasi; build EXIT=0, Playwright SEMUA PAS)
  - [- **Detail Fitur Katalog Produk Utama**:
    - Menampilkan 3 produk unggulan utama (Sisha, BBQ, Quick Lighting).
    - Setiap kartu produk dilengkapi 2 ikon kecil di bagian bawah: **Jumlah Suka (Buyer Order)** dan **Keranjang (Order/Inquiry)**.
    - **Informasi detail produk mencakup**:
      - **Nama Produk**
      - **Spesifikasi Teknis**: (Ash Content), Warna, (Burning Time), Bau & Asap (No Smoke & No Odor), serta field dinamis opsional lainnya.
      - **MOQ (Minimum Order Quantity)**: Pilihan kategori (18/20 ft container, 50-100 kg, hingga 2-10 ton).
      - **Kemasan Order (Packaging)**: Master Box (10, 20, 30 kg), Mini Box (500, 5000 gram), dan Special Box (25, 500, 1000 kg).
      - **Opsi Pengiriman (Delivery)**: 
        - Domestik (Indah Kargo, JTR, Fuso, Dahkota) dengan catatan ongkir mandiri atau tagihan menyeluruh.
        - Luar Negeri (FOB, CFR, CIF) dengan catatan kelengkapan dokumen legalitas (B/L, COO/SKA, MSDS, Fumigasi).
    - Menampilkan harga per 1 KG = 18.000 rupiah dan sesuaikan setiap prodak.
    - Menampilkan fungsi atau kegunaan setiap prodak.
- [x] **Security Agent**: Audit Form Kontak terhadap serangan spam (Honeypot/reCAPTCHA) dan injeksi skrip. <!-- @security --> (Selesai: honeypot uncontrolled silent-block, validasi client, CSP `form-action 'self'`, input sanitize trim; Test bot honeypot pass)
- [x] **UI/UX Agent**: Detail kontak — layout ulang, jam operasional, WeChat QR, sosmed, legal links, copyright. <!-- @ui-ux --> (Selesai: kontak+kontkan layout 2 kolom, QR SVG dummy, sosmed 4 kanal, legal 7 links, footer copyright; Playwright 22/22 pass) 

## [x] Phase 3: Revisi (Single-Page Website) ✓ SELESAI
- [x] **UI/UX & Dev**: Tujuan utama: Mengubah website menjadi single-page website pada route /. Tanpa membangun ulang desain atau fitur yang sudah selesai.
  - [- **Detail Utama**:
    - Pertahankan seluruh desain, komponen, fitur, animasi, dan styling yang sudah ada.
    - Gabungkan konten /produk dan /kontak ke halaman utama / sebagai section yang dapat di-scroll.
    - Navbar tidak lagi berpindah ke halaman /produk atau /kontak, tetapi melakukan smooth scroll ke section terkait.
    - Gunakan section ID:
        - #home
        - #produk
        - #service
        - #kontak
    - Pastikan halaman dapat di-scroll secara vertikal dari atas sampai footer.
    - Hindari horizontal scrolling dan nested scroll yang tidak diperlukan.
    - Jangan membuat ulang komponen yang sudah ada. Reuse existing components.
    - Jangan melakukan redesign atau perubahan visual yang tidak diperlukan.
    - Jika route sudah tidak diperlukan, hapus atau redirect dengan aman tanpa merusak fungsi yang ada.
    - Pastikan responsive pada mobile, tablet, dan desktop].
- [x] **QA Agent**:Setelah perubahan, lakukan build, lint, dan test untuk memastikan tidak ada regresi. (Selesai: build EXIT=0; qa-singlepage 3 viewport SEMUA PAS; qa-navbar regression SEMUA PAS; qa-phase2 SEMUA PAS; redirect /produk /service /kontak → 307 ke anchor)

- [x] **UI/UX & Dev**: Tujuan utama untuk mengatur ulang layout prodak. (Selesai: product order calculator, grand total, login gating, selector interactive) <!-- @ui-ux @dev -->
  - [- **Detail Fitur Katalog Produk Utama**:
    - Layouting ulang card beserta informasi didalamnya. Pastikan user friendly.
    - Pastikan user bisa melakukan klik pada button di MOQ, Packing, dan shipping untuk memilih.
    - Berikan skema kalkulator yang bersejajar dengan button **Kirim Inquiry Sekarang**, setelah memilih:
        - Skenario 1 adalah user domestik: sehingga hanya terpusat oleh data pilihan domestik yang tersedia (Payment, Delivery, Pacjing, MOQ) yang sudah dijelaskan di phase 2.
        - Skenario 2 adalah user luar negeri: menggunakan data pilihan luar negeri (Payment, Delivery, Pacjing, MOQ) yang sudah dijelaskan di phase 2.
        - Skenario 3 ketika user sudah cocok dengan skema kalkulator tersebut, maka akan diarahkan ke **form Inquiry**. Disini berfungsi setelah user sudah selesai mengisi form dan ingin melakukan kirim, dengan kondisi ketika user belum login akan muncul alert **Daftar Atau Login Akun terlebuh dahulu**, dan diarahkan ke menu Login. Setelah itu Order bisa dikirim.
    - Berikan tambahan Grand Total sederhana setelah user melakukan skema order.
    - Informasi Akurat akan saya informasikan di next progres. jadi, lakukan sesuai perintah sebelumnya.
- [x] **QA Agent**:Setelah melakukan perubahan, lakukan build, lint, dan test. (Selesai: build EXIT=0, lint clean, qa-phase3-4 SEMUA PAS 3 viewport, regressi 5 suite pass)

## [x] Phase 4: Service ✓ SELESAI
- [x] **UI/UX & Dev Agent**: Bangun section **Service** pada halaman utama (`#service`) dengan mempertahankan design system, styling, animasi, dan pola komponen yang sudah digunakan pada website. (Selesai: Order Roadmap 5 tahap, Order Tracking input+status area, Company Certifications ISO.pdf + badge, responsive, new tab aman) <!-- @ui-ux @dev -->
  - [- **Detail Utama**:
    - Buat **Roadmap Order Produk** sebagai visual utama pada section Service.
    - Roadmap dapat menggunakan **gambar, ilustrasi, atau desain 3D** yang tersedia pada project.
    - Roadmap harus menjelaskan alur order produk secara berurutan:
        1. **Login Account**
        2. **Order Product**
        3. **Transaction**
        4. **Delivery**
        5. **Order Completed**
    - Setiap tahap roadmap harus memiliki **informasi/panduan singkat** agar buyer memahami proses order dari awal hingga selesai.
    - Gunakan assets yang tersedia di project apabila relevan dan jangan membuat asset pengganti jika asset yang sesuai sudah tersedia.
    - Setelah roadmap, tambahkan **Order Tracking**.
    - Sediakan search/input untuk memasukkan **Order ID**.
    - User dapat menggunakan Order ID tersebut untuk melakukan tracking status pesanan.
    - Untuk sementara, apabila sistem tracking dinamis belum tersedia, buat UI/UX tracking yang siap dikembangkan tanpa membuat data tracking palsu yang terlihat seperti data nyata.
    - Setelah bagian Order Tracking, tampilkan **Company Certifications**.
    - Tampilkan **lebih dari satu sertifikasi** yang dimiliki perusahaan.
    - Gunakan seluruh assets/dokumen sertifikasi yang tersedia pada folder **`assets/doc`**.
    - **Pastikan semua file yang relevan di `assets/doc` digunakan dan tidak ada yang terlewat.**
    - Atur layout sertifikasi agar tetap rapi, profesional, responsive, dan mudah dipahami.
    - Setiap sertifikasi harus dapat diklik untuk melihat dokumen/asset secara lebih lengkap.
    - Saat sertifikasi atau dokumen diklik, buka dokumen pada **new tab** menggunakan mekanisme yang aman.
    - Jangan mengubah, menghapus, atau memindahkan file pada `assets/doc` tanpa kebutuhan.
    - Pastikan seluruh asset yang digunakan memiliki path/reference yang valid dan tidak menghasilkan broken asset.
  - [- **Struktur Section Service**:
        - **Order Roadmap**
            - Visual roadmap hanya berisikan informasi
            - 5 tahapan order
            - Panduan singkat setiap tahapan berupa deskripsi

        - **Order Tracking**
            - Order ID input/search
            - Area untuk menampilkan status tracking
            - Siap dikembangkan menjadi sistem tracking dinamis (next progres)

        - **Company Certifications**
            - Multiple certification cards corausel yang menampilkan entitas Sertifikasi (Logo).
            - Menggunakan seluruh asset relevan dari `assets/doc`
            - Click = open document in new tab
- [x] **Dev Agent**: Pastikan Service terintegrasi langsung pada halaman utama `/` melalui section `#service` dan tidak membuat halaman Service terpisah. (Selesai: #service dalam app/page.tsx)
- [x] **UI/UX Agent**: Pastikan seluruh Service section responsive pada mobile, tablet, dan desktop serta tetap konsisten dengan design system website. (Selesai: stepper horizontal md / vertikal mobile; tracking + cert grid responsive) <!-- @ui-ux -->
- [x] **QA Agent**: Setelah implementasi, lakukan:
  - Test visual Service section pada mobile, tablet, dan desktop. (Playwright 3 viewport)
  - Test Order ID search/input. ✅
  - Test seluruh sertifikasi dapat ditampilkan. ✅
  - Test seluruh dokumen dari `assets/doc` yang relevan digunakan. ✅ (ISO.pdf)
  - Test setiap sertifikasi/dokumen dapat dibuka pada new tab. ✅ (ISO.pdf target=_blank noopener)
  - Pastikan tidak ada broken asset atau broken link. ✅ (ISO.pdf 200)
  - Jalankan build dan lint untuk memastikan tidak ada regresi. ✅ (build EXIT=0, lint clean, 5 suite pass)

## [ ] Phase 5: Final Revisi
- [ ] **UI/UX & Dev Agent**: Finalisasi bagian Service dan Product dengan fokus pada **Company Certifications, Country Flags, dan Product Images**. <!-- @ui-ux @dev -->
  - [- **Company Certifications**:
    - Ubah tampilan certification cards menjadi **auto-moving horizontal carousel**.
    - Carousel bergerak **otomatis dan terus-menerus ke arah samping secara smooth**.
    - **Tidak menggunakan tombol next/previous, arrow, atau membutuhkan klik untuk menggerakkan carousel.**
    - User cukup melihat carousel berjalan secara otomatis.
    - Pertahankan fungsi klik pada certification card untuk membuka dokumen sertifikasi pada **new tab** seperti implementasi Phase 4.
    - Jangan mengubah atau menghilangkan dokumen sertifikasi yang sudah digunakan.
  - [- **Country Flags**:
    - Pastikan juga **auto-moving horizontal carousel** untuk flags negara afiliasi.
    - Carousel bergerak **otomatis, smooth, dan terus-menerus ke arah samping** tanpa interaksi klik.
    - Posisi Country Flags berada **di bawah Company Certifications**.
    - Gunakan data negara:
      - USA
      - China
      - Arab
      - German
      - Perancis
      - Iran
      - Iraq
      - Korea Selatan
      - Jepang
    - Tampilkan flag dengan ukuran dan spacing yang konsisten.
    - Pastikan carousel tidak menyebabkan horizontal page overflow.
  - [- **Product Images**:
    - Ganti gambar produk yang saat ini digunakan dengan **asset produk asli** yang telah disediakan pada: `components/assets/prodak`
    - Periksa seluruh file dalam folder tersebut terlebih dahulu.
    - Cocokkan setiap asset dengan produk yang sesuai berdasarkan nama/konteks file.
    - Contoh: asset dengan nama yang mengarah ke **BBQ Charcoal** digunakan untuk produk BBQ.
    - Sesuaikan ukuran, aspect ratio, object-fit, dan styling gambar agar tetap proporsional dengan layout card yang sudah ada.
    - Jangan mengubah informasi, kalkulator, tombol, atau fungsi produk yang sudah selesai pada Phase sebelumnya.
    - Jangan membuat gambar placeholder baru jika asset yang sesuai sudah tersedia.
  - [- **Design & Interaction**:
    - Pertahankan design system dan visual website yang sudah ada.
    - Gunakan animasi yang ringan dan smooth.
    - Jangan menggunakan carousel yang membutuhkan user interaction untuk melakukan perpindahan slide.
    - Pastikan animasi tidak mengganggu readability atau usability.
    - Hormati `prefers-reduced-motion` apabila memungkinkan tanpa mengubah fungsi utama.
    - Jangan melakukan redesign bagian lain di luar scope Phase 5.
- [ ] **QA Agent**: Lakukan QA khusus pada **Company Certifications, Country Flags, dan Product Images**. <!-- @qa -->
  - Pastikan certification carousel bergerak otomatis dan smooth.
  - Pastikan flags carousel bergerak otomatis dan smooth.
  - Pastikan tidak ada tombol/klik yang diperlukan untuk menggerakkan carousel.
  - Pastikan certification card tetap dapat diklik untuk membuka dokumen pada new tab.
  - Pastikan seluruh flag negara ditampilkan.
  - Pastikan seluruh product card menggunakan asset dari `components/assets/prodak`.
  - Pastikan tidak ada broken image atau missing asset.
  - Pastikan tidak terjadi horizontal page overflow.
  - Test responsive pada mobile, tablet, dan desktop.
  - Pastikan perubahan tidak merusak fitur Phase 4 dan Phase 3.
  - Jalankan build dan lint setelah perubahan.

## [ ] Phase 6: Globalization & Authentication (Dinamis)
- [ ] **Dev Agent**: Setup i18n localization framework dan konfigurasi skema PostgreSQL.
- [ ] **Security Agent**: Audit mendalam terhadap enkripsi hashing password dan mekanisme proteksi session pembeli internasional. <!-- @security -->
-