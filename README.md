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

## 💳 Alur Pembayaran (Payment Flow) Baru
Sistem menggunakan penetapan harga dinamis untuk beberapa layanan dan status verifikasi berjenjang:
1. **Pending Confirmation:** Pemesanan paket atau charter yang belum ada harganya. Admin mengkalkulasi harga final dan merilis tagihan.
2. **Pending Payment:** Pelanggan memilih metode pembayaran (Cash/Transfer).
3. **Payment Upload:** Jika transfer, pelanggan mengunggah bukti pembayaran via sistem popup.
4. **Verification:** Admin memeriksa bukti transfer pada **Payment Preview Modal** di panel Admin, lalu mengonfirmasi keabsahan uang masuk.
5. **Verified & Settled:** Status menjadi Lunas. Kas secara otomatis tercatat di sistem Cashflow (buku besar).

## 🎁 Alur Promosi (Promotion Flow) Baru
1. Admin membuat *Campaign/Promotion* aktif melalui panel CMS (*Content Management System*).
2. Data promo tayang di halaman publik (Banner atau penawaran khusus).
3. Pengguna yang melakukan pesanan akan mendapatkan penyesuaian harga atau keuntungan sesuai dengan promosi yang berlaku saat checkout (harga akan terpotong).

## 🛒 Alur Pemesanan Pengguna (User Order Flow) Baru
- **Travel Reguler:** User mencari jadwal -> Pilih kursi (Kursi terkunci otomatis 10 menit) -> Mengisi form detail Pick-up & Drop-off -> Bayar -> Tiket terbit.
- **Sewa Charter:** User mengajukan rute destinasi pariwisata -> Admin menyetujui, menginput harga manual, serta **menugaskan armada, supir 1, dan supir 2 (cadangan)** -> User setuju dan bayar.
- **Ekspedisi Paket:** User memasukkan detail muatan & dimensi -> Sistem menerbitkan nomor Resi unik (Waybill) -> Admin tentukan ongkir -> User bayar -> Paket dapat dilacak status pengirimannya (dikirim, dalam perjalanan, tiba).

## 👨‍💼 Hal-hal Baru yang Dikelola Admin
- **Halaman Penugasan (Assignments):** Memungkinkan admin menugaskan armada (`fleet_id`) dan tim supir secara spesifik pada jadwal tertentu sebelum dikerjakan.
- **Payment Preview:** Modal khusus di sisi admin untuk memvalidasi gambar *screenshot*/resi transfer.
- **Manajemen Roles & Restriksi:** Admin memiliki kuasa menolak/menyetujui klaim operasional (bensin/tol supir), namun sistem mengunci Super Admin agar tidak dapat menghapus akun admin lainnya.

## ⚙️ Hal-hal yang Otomatis Dilakukan Sistem
1. **Auto Seat-Locking & Cancel:** Sistem menjalankan cron-job yang mengamankan kursi selama 10 menit untuk mencegah double-booking, dan otomatis membatalkan jika tak ada pembayaran.
2. **Auto Waybill Generator:** Penciptaan otomatis nomor resi logistik yang unik bagi pelanggan paket.
3. **Cashflow Automation (Triggers):** Perekaman transaksi finansial otomatis (Kas Masuk/Keluar) yang akan menghitung metrik Gross Profit & Net Profit di halaman Dashboard setiap kali ada transaksi disetujui.
