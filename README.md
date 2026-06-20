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

4. **Selesai (Completed / Ready for Pickup)**
   * *Untuk Cashless:* Begitu Admin memverifikasi uang masuk, status menjadi Selesai dengan catatan *"Silakan tunggu dijemput"*.
   * *Untuk Cash:* Begitu User memilih *Cash* (langsung), Admin dapat memverifikasinya nanti, atau otomatis status berubah dengan catatan *"Bayar nanti saat sudah dijemput"*.

---
© 2026 PT Rini Trans Putri. All Rights Reserved.
