# PT Rini Trans Putri - Sistem Manajemen Reservasi dan Promosi

## 📖 Ringkasan (Overview)
**PT Rini Trans Putri** adalah sebuah platform Sistem Informasi Manajemen Reservasi dan Promosi modern yang terintegrasi. Sistem ini dirancang untuk menangani operasional bisnis inti dari penyedia jasa transportasi (travel reguler, sewa/charter armada) dan logistik (pengiriman paket). Sistem ini memfasilitasi seluruh proses secara *end-to-end*, mulai dari interaksi pelanggan, otomatisasi penugasan armada dan supir, pelacakan pengiriman (waybill), hingga pencatatan transaksi keuangan (cashflow) secara terpusat.

Sistem dibangun dengan prinsip keamanan tinggi, skalabilitas, dan antarmuka yang ramah pengguna, menjadikannya solusi andal bagi manajemen dalam memantau operasi harian serta merencanakan strategi promosi.

---

## 🚀 Stack Teknologi (Tech Stack)
Aplikasi ini dikembangkan dengan pendekatan *Component-Based Development (CBD)* menggunakan tumpukan teknologi modern untuk memastikan performa yang maksimal dan pemeliharaan jangka panjang:

*   **Frontend Framework:** [Astro 6.0+](https://astro.build/) - Framework web untuk performa pemuatan yang sangat cepat melalui arsitektur modular.
*   **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) - *Utility-first CSS framework* untuk desain UI/UX yang modern, konsisten, dan responsif.
*   **Runtime Environment:** [Node.js 22+](https://nodejs.org/) - Lingkungan eksekusi *server-side* dengan performa tinggi.
*   **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/) - Memberikan *static typing* secara ketat untuk mencegah *runtime error* dan memudahkan proses pengembangan kolaboratif.

---

## ⚙️ Bagaimana Sistem Ini Berjalan dan Bekerja
Sistem **Rini Trans Putri** beroperasi melalui sinkronisasi antara *client-side* (pengguna akhir) dan proses otomasi *server-side*, dengan alur kerja arsitektural sebagai berikut:

1. **Otentikasi & Manajemen Sesi:** Pengguna (Pelanggan, Supir, Admin) masuk ke dalam sistem dengan tingkat akses otorisasi yang ketat. Sistem mengelola sesi dan *role-based access control* (RBAC).
2. **Integrasi Layanan (Services):** Semua interaksi data dari antarmuka diteruskan ke *backend API* melalui lapisan *services*. Hal ini memastikan pemisahan *concern* antara presentasi (UI) dan logika bisnis.
3. **Otomatisasi Sistem (Auto-Triggers & Cron-jobs):** Sistem secara otomatis membatalkan pemesanan dan membebaskan kursi (*seat-locking*) jika pembayaran tidak diselesaikan dalam *window time* 10 menit untuk menghindari *double-booking*.
4. **Cashflow Automation:** Setiap validasi pembayaran sukses di sisi Admin secara otomatis memicu eksekusi fungsi yang mencatat transaksi kas (masuk/keluar), menghitung *Gross Profit*, dan *Net Profit* secara instan pada basis data laporan keuangan.

---

## 🛒 Alur Pemesanan (Order Flow)
Sistem memiliki tiga pilar bisnis utama dengan alur pemesanan spesifik:

### 1. Travel Reguler (Penumpang)
*   **Pencarian & Pemilihan:** Pelanggan mencari rute dan jadwal yang tersedia.
*   **Seat-Locking:** Saat kursi dipilih, sistem secara otomatis mengunci ketersediaan (*lock*) selama 10 menit.
*   **Detail Penjemputan:** Pelanggan mengisi formulir titik jemput (*Pick-up*) dan tujuan (*Drop-off*).
*   **Pembayaran & Tiket:** Setelah pembayaran dilakukan dan dikonfirmasi, sistem secara otomatis menerbitkan tiket perjalanan digital.

### 2. Sewa Armada (Charter / Pariwisata)
*   **Pengajuan Rute:** Pelanggan mengajukan rute dan tanggal untuk keperluan penyewaan armada penuh.
*   **Penetapan Harga Dinamis:** Admin meninjau rute yang diminta, lalu menetapkan harga secara manual (status pesanan menjadi *Pending Confirmation*).
*   **Penugasan (Assignment):** Admin mengalokasikan unit armada spesifik beserta formasi Supir Utama dan Supir Cadangan.
*   **Penyelesaian:** Pelanggan menyetujui harga akhir, melakukan pembayaran, dan reservasi secara resmi dijadwalkan.

### 3. Ekspedisi (Pengiriman Paket)
*   **Input Detail:** Pelanggan memasukkan rincian muatan (berat, dimensi, jenis barang).
*   **Waybill Generation:** Sistem langsung melakukan otomasi pembuatan nomor Resi / Waybill unik.
*   **Kalkulasi Ongkir:** Admin menetapkan biaya pengiriman sesuai rincian fisik muatan.
*   **Pelacakan (Tracking):** Setelah pembayaran selesai, paket diproses dan pelanggan dapat melacak status terkini *(dikirim, dalam perjalanan, tiba)* berbekal nomor resi.

---

## 💳 Alur Pembayaran dan Promosi

### Manajemen Pembayaran Multi-Tahap
1. **Pending Confirmation:** Tahap transisi menunggu Admin menentukan harga bagi layanan kustom (Charter/Paket).
2. **Pending Payment:** Tagihan dirilis, pelanggan memilih metode pembayaran (Transfer Bank atau Tunai).
3. **Payment Upload:** Pelanggan mengunggah bukti bayar secara digital melalui antarmuka *popup*.
4. **Verification:** Admin menggunakan antarmuka khusus **Payment Preview** untuk memvalidasi keabsahan bukti transfer dari pelanggan.
5. **Verified & Settled:** Transaksi berstatus Lunas. Dana otomatis dicatat oleh algoritma *Cashflow Ledger* tanpa intervensi rekapitulasi manual.

### Sistem Promosi Terpusat (CMS)
Admin memiliki kendali komprehensif untuk mendesain dan mengaktifkan *Campaign/Promotion* melalui panel CMS. Konfigurasi promosi ini secara *real-time* diproyeksikan sebagai *banner* atau penawaran khusus pada beranda pelanggan. Pada fase *checkout*, mesin perhitungan harga akan tervalidasi secara mandiri, memberikan pemotongan/penyesuaian tarif sesuai dengan promosi aktif tersebut.

---

## 🔐 Aksesibilitas dan Keamanan Hak Akses (User Roles)
Hak akses dikelola dan dipartisi secara ketat dengan spesifikasi berikut:
1.  **Guest (Tamu Publik):** Hanya memiliki otoritas untuk mengakses informasi ketersediaan, rute reguler, dan etalase promosi.
2.  **Customer (Pelanggan Terdaftar):** Berwenang melakukan reservasi *end-to-end*, melacak pengiriman, mengelola riwayat transaksi, dan mengedit profil akun.
3.  **Driver (Supir):** Memiliki antarmuka portabel (panel khusus) untuk meninjau penugasan harian, memantau manifes operasional penumpang, serta mendokumentasikan klaim biaya operasional harian (BBM, Tol) kepada sistem.
4.  **Admin / Manajerial:** Memegang kendali manajerial penuh atas verifikasi arus kas, penugasan armada dan sumber daya manusia, manajemen *campaign* CMS, hingga analitik *dashboard* finansial. Skema keamanan melarang mutasi atau penghapusan level hierarki tertingginya (*Super Admin*).

---

## 💻 Panduan Menjalankan Sistem Secara Lokal (Development)

Bagi pengembang sistem, gunakan instuksi *Command Line Interface (CLI)* berikut untuk inisialisasi lingkungan kerja lokal:

| Command (Perintah) | Deskripsi Teknis |
| :--- | :--- |
| `npm run dev` | Mengeksekusi server pengembangan dengan kapabilitas *Hot-Reload* untuk efisiensi *debugging* antarmuka. |
| `npm run build` | Mengompilasi keseluruhan basis kode (*source code*) untuk men-generate bundel aset statis skala produksi. |
| `npm run preview` | Menjalankan *instance* server secara lokal guna menyimulasikan prilaku bundel aplikasi pasca-*build* produksi. |
| `npx astro check` | Memicu linting diagnostik untuk memastikan seluruh anotasi keamanan tipe TypeScript (TypeScript *Type-Checking*) terpenuhi tanpa peringatan teknis. |
