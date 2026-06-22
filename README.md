# PT Rini Trans Putri - Reservation & Promotion System

Sistem Informasi Manajemen Reservasi dan Promosi PT Rini Trans Putri dibangun menggunakan teknologi modern untuk memberikan pengalaman pemesanan tiket perjalanan dan pengiriman paket yang cepat, aman, dan intuitif.

## 🚀 Stack Teknologi
*   **Framework:** [Astro 6.0+](https://astro.build/) - Pengembangan berbasis komponen dengan performa maksimal.
*   **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) - Desain UI modern dan responsif.
*   **Runtime:** [Node.js 22+](https://nodejs.org/) - Lingkungan eksekusi sisi server yang stabil.
*   **Bahasa:** [TypeScript](https://www.typescriptlang.org/) - Keamanan tipe data untuk pemeliharaan jangka panjang.

## 🏗️ Arsitektur Proyek
Proyek ini mengikuti pola **Component-Based Development (CBD)** dengan struktur folder sebagai berikut:

```text
/
├── public/              # Aset statis publik (favicon, etc)
├── src/
│   ├── assets/          # Aset desain (images, fonts, icons)
│   ├── components/
│   │   ├── features/    # Komponen fungsional spesifik fitur (Admin, User, Driver)
│   │   ├── shared/      # Komponen global (Navbar, Footer)
│   │   └── ui/          # Komponen dasar atomik (Button, Input, Badge)
│   ├── layouts/         # Template struktur halaman utama
│   ├── pages/           # Routing halaman utama sistem
│   ├── services/        # Logika integrasi API backend
│   ├── styles/          # Konfigurasi CSS Global
│   └── utils/           # Fungsi pembantu dan pengaman (AuthGuard)
└── tsconfig.json        # Konfigurasi Path Aliases (@ui, @features, etc)
```

## 🛠️ Perintah Utama

| Command | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal |
| `npm run build` | Membangun proyek untuk tahap produksi |
| `npm run preview` | Meninjau hasil build produksi secara lokal |
| `npx astro check` | Melakukan audit statis pada sintaks dan TypeScript |

## 🔐 Tingkat Akses (User Roles)
1.  **Guest:** Mengakses info layanan, rute, dan jadwal.
2.  **Customer:** Melakukan reservasi tiket, sewa armada, dan kirim paket.
3.  **Supir:** Mengelola manifes penumpang dan laporan biaya operasional.
4.  **Admin:** Panel kendali penuh terhadap konten, armada, dan laporan keuangan.

## 💳 Alur Pembayaran Pemesanan (Payment Flow)
Sistem ini menggunakan mekanisme penetapan harga dinamis (oleh Admin) sebelum pelanggan melakukan pembayaran. Berikut adalah siklus hidup pemesanan dari awal hingga selesai:

1. **Menunggu Konfirmasi (Pending Confirmation)**
   * User membuat pesanan (Travel, Charter, atau Paket) tanpa langsung melakukan pembayaran.
   * Data masuk ke panel Admin. Admin akan meninjau pesanan dan **menetapkan/menginput harga akhir** (misalnya menambahkan biaya *double charge* jika paket besar, atau harga negosiasi untuk Charter).

2. **Menunggu Pembayaran (Pending Payment)**
   * Setelah harga ditetapkan Admin, status pesanan di halaman "Riwayat Pesanan" User berubah.
   * User kini melihat tombol aksi **"Bayar"**.
   * User memilih metode pembayaran: **Cash** (Tunai ke Supir) atau **Cashless** (Transfer).
   * *Jika Cashless:* Sebuah Pop-up Alert berisi **QRIS Statis** dan **Nomor Rekening** akan muncul ke tengah layar. User mentransfer sesuai nominal harga dan mengeklik tombol "Konfirmasi Sudah Bayar".

3. **Menunggu Pengecekan (Verification / Checking)**
   * Setelah User mengkonfirmasi transfer, status berubah menjadi Menunggu Pengecekan.
   * Admin akan memverifikasi di panel mereka apakah mutasi/dana sudah benar-benar masuk. Admin mengeklik tombol "Konfirmasi Pembayaran".

   * *Untuk Cashless:* Begitu Admin memverifikasi uang masuk, status menjadi Selesai dengan catatan *"Silakan tunggu dijemput"*.
   * *Untuk Cash:* Begitu User memilih *Cash* (langsung), Admin dapat memverifikasinya nanti, atau otomatis status berubah dengan catatan *"Bayar nanti saat sudah dijemput"*.

## 🎁 Alur Proses Promosi (Promotion Flow)
Tampilan promo di halaman Home (Beranda) dan Layanan (Services) dikendalikan secara mutlak oleh satu sumber data (*Single Global Promo*) dari Backend. Berikut adalah logika yang diterapkan:
1. **Penarikan Data Tunggal:** Frontend hanya memanggil satu endpoint global (`GET /api/content/promotions`) yang akan mengembalikan 1 promo aktif. 
2. **Pemetaan UI Dinamis:** 
   * **Besaran Diskon:** Angka persentase diskon (`discount_percentage`) dibulatkan dan ditampilkan secara masif (misal "20% OFF") di Beranda dan Layanan.
   * **Tagline Promo:** Teks `tagline` dari *database* ditampilkan utuh di halaman Layanan, namun secara otomatis dipotong menjadi 3 baris di halaman Beranda untuk menyesuaikan desain visual (*hero layout*).
   * **Gambar Latar:** Elemen gambar pada *banner* promosi murni menggunakan `image_url` dari respons Backend. Jika Backend tidak merespons atau gambar kosong, komponen promosi akan menyembunyikan dirinya secara otomatis (*failsafe/graceful degradation*).
3. **Ketiadaan Konsep "Klaim Manual":** Tombol pada banner promo tidak berfungsi sebagai tombol "Klaim/Simpan Voucher". Tombol tersebut hanya berfungsi sebagai pengarah (*redirect*) ke halaman pemesanan layanan rute reguler (`/services`).
4. **Penerapan Diskon Otomatis (Oleh BE):** Jika pelanggan memesan layanan dan kebetulan terdapat Promo yang sedang aktif, maka **Backend wajib melakukan kalkulasi diskon secara otomatis**.
5. **Proses Admin:** Saat Admin menginput harga (*Total Price*) untuk pesanan yang masuk, Backend akan memotong harga tersebut secara sistem (dengan mempertimbangkan parameter `max_discount`) **sebelum** harga final tersebut dikembalikan sebagai respons API dan ditampilkan kepada pengguna di halaman "Riwayat Pesanan".

---
© 2026 PT Rini Trans Putri. All Rights Reserved.
