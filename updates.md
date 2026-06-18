# Log Pembaruan Sistem (Updates)

Berikut adalah rekapitulasi seluruh pembaruan, perbaikan, dan fitur baru yang telah diimplementasikan ke dalam kode front-end:

## 👨‍💻 Sisi User (Customer & Guest)
*   **Redesign Favorit Destination:** Pembaruan desain kartu dan transisi detail destinasi di halaman Home.
*   **Modernisasi Promo Banner:** Komponen promosi di laman layanan kini menggunakan desain modern dengan efek kaca (*glassmorphism*) dan skema warna `sky-500`.
*   **Optimasi Form Reservasi:**
    *   Pengaturan harga default rute regular menjadi Rp 250.000.
    *   Penyederhanaan kartu jadwal rute (hanya Hari & Tanggal).
    *   Integrasi `Double Charge Notice` otomatis untuk paket besar (>20kg).
*   **Akses Guest Fleksibel:** Pengguna belum login kini bisa bebas melihat rute dan jadwal tanpa dipaksa redirect, kecuali saat mencoba memesan kursi/input data.

## 🔑 Sisi Admin (Dashboard & Content Management)
*   **Astro Path Aliases:** Implementasi alias routing `@ui`, `@features`, dll. untuk menggantikan impor relatif `../../../`.
*   **Responsivitas Sidebar:** Sidebar admin kini otomatis menjadi *floating drawer* dengan tombol Hamburger pada tampilan mobile.
*   **Dashboard Overhaul:** Penghapusan grafik pendapatan lama, diganti dengan list "Daftar Armada Sedang Bertugas" secara *real-time*.
*   **Manajemen Keuangan:** Standarisasi form "Masukan Data Pengeluaran" menggunakan komponen `InputGroup`.
*   **Manajemen Konten:** Penyatuan sistem sinkronisasi promo antara Home dan Layanan.
*   **Manajemen Armada & Destinasi:** Penambahan fitur *toggle grid*, pencarian dinamis, dan sistem hapus simulasi di sisi klien.

## 🚛 Sisi Supir (Driver Interface)
*   **Mobile-First Layout:** Penyesuaian layout agar nyaman diakses supir melalui smartphone saat sedang bertugas.
*   **Form Biaya Operasional:** Perbaikan field input untuk laporan nota/kuitansi pengeluaran bensin dan tol.

## 🛠️ Perbaikan Teknis (Bug Fixes)
*   **SSR Import Error:** Memperbaiki seluruh error `FailedToLoadModuleSSR` dengan menstabilkan konfigurasi `tsconfig.json`.
*   **Syntax & Type Fix:** Menyelesaikan puluhan error TypeScript (`astro check`) pada komponen sidebar, dashboard, dan FAQ.
