# Daftar Perubahan & Status Implementasi Proyek (PT Rini Trans Putri)

Dokumen ini merangkum seluruh perubahan (tambahan dan modifikasi) yang telah dilakukan pada sisi Frontend sejauh ini, serta daftar tugas yang masih belum diimplementasikan (To-Do).

---

## ✅ BAGIAN 1: DAFTAR PERUBAHAN & IMPLEMENTASI YANG SUDAH SELESAI

Berikut adalah daftar modul Frontend yang sudah terintegrasi penuh secara fungsional dan UI dengan (mengacu pada) dokumentasi Backend:

### 1. Modul Autentikasi (Login & Register)
- **File Baru/Modifikasi:** `src/pages/auth/login.astro`, `src/services/authService.ts`
- **Pencapaian:** 
  - Form Login terhubung ke `POST /api/auth/login`. Menyimpan Token JWT di `localStorage`.
  - Form Registrasi terhubung ke `POST /api/auth/register`.
  - Implementasi perlindungan rute (Role-Based Access Control) yang mengarahkan Admin, Driver, dan Customer ke dashboard yang tepat setelah login.

### 2. Modul Konten Publik (Halaman Beranda & Layanan)
- **File Baru/Modifikasi:** `src/pages/index.astro`, `src/pages/services.astro`, `src/services/contentService.ts`, Komponen Hero, Promo, dan Destinasi.
- **Pencapaian:** 
  - Data *dummy* dihapus sepenuhnya. Menggunakan Server-Side Rendering (SSR) Astro untuk menarik data Banners, Promo Aktif, dan Destinasi dari Backend (`/api/content/...`).
  - Menerapkan arsitektur *Fail-Safe* (Antarmuka tidak rusak meski database BE sedang kosong/error).

### 3. Modul Pemesanan Travel Reguler
- **File Baru/Modifikasi:** `RouteBookingForm.astro`, `SeatMap.astro`, `src/services/travelService.ts`
- **Pencapaian:** 
  - Mengubah logika UI agar Jadwal dihasilkan secara dinamis (14 hari ke depan).
  - Melindungi denah kursi dengan *Auth Guard* (Tamu harus login sebelum dapat mengunci kursi).

### 4. Modul Riwayat Pesanan Customer (User Dashboard)
- **File Baru/Modifikasi:** `src/pages/user/booking-history.astro`, `src/services/userService.ts`
- **Pencapaian:** 
  - Memanggil 3 endpoint riwayat secara paralel (Travel, Charter, Paket Ekspedisi) untuk performa muat lebih cepat.
  - Menerapkan *Hybrid Mapper* untuk menyeragamkan berbagai jenis data JSON dari BE menjadi satu bentuk UI Kartu Riwayat yang konsisten.

### 5. Modul Ringkasan & Operasional Admin (Dashboard Utama)
- **File Baru/Modifikasi:** `src/pages/admin/index.astro`, `src/services/adminDashboardService.ts`
- **Pencapaian:** 
  - Sinkronisasi Kartu Metrik Keuangan (Omzet, Total Booking) dengan data BE (`/api/admin/dashboard/metrics`).
  - Penyiapan kerangka untuk menerima Tabel *Active Duties* dan Izin Keberangkatan Sopir.

### 6. Modul Manajemen Pemesan & Ekspedisi Admin
- **File Baru/Modifikasi:** `src/pages/admin/bookings.astro`, `src/pages/admin/packages.astro`, `src/services/adminBookingService.ts`
- **Pencapaian:** 
  - Mengganti tabel statis dengan hasil fetching dari rute `/api/admin/master/...`.
  - Menerapkan validasi parsing alamat (Mencegah keruntuhan aplikasi jika struktur alamat dari BE meleset).

### 7. Modul Kelola Konten CMS Admin (Promo, Armada, Destinasi)
- **File Baru/Modifikasi:** `src/pages/admin/content.astro`, `destinations.astro`, `fleet.astro`, `src/services/adminContentService.ts`
- **Pencapaian:** 
  - Menyambungkan seluruh tombol "Simpan" dan "Hapus" pada antarmuka admin dengan logika Javascript *Client-side* (`FormData`).
  - Admin kini bisa menambah armada, mengubah promo, atau menghapus destinasi, dan hal tersebut akan seketika mengubah tampilan publik pelanggan.

---

## ⏳ BAGIAN 2: TO-DO LIST (YANG BELUM DIIMPLEMENTASIKAN)

Tugas-tugas di bawah ini masih tertunda, sebagian besar karena masalah kecocokan dengan Backend atau memang belum dikerjakan.

### 🔴 Blocker dari Tim Backend (Wajib Diperbaiki BE agar FE bisa jalan)
- [ ] **Endpoint Publik Armada:** Backend belum menyediakan `GET /api/content/fleets` (Dibutuhkan di halaman form Charter User agar data armada muncul).
- [ ] **Error Pengiriman Paket:** API `POST /api/packages/shipments` saat ini melempar **Error 500**. Tabel DB sepertinya kekurangan kolom `pickup_address`.
- [ ] **Skema Alamat Bersarang (Nested JSON):** Halaman Admin Bookings (`/admin/bookings`) menolak data alamat berbentuk *String* biasa. Backend wajib mengirim alamat dalam bentuk Objek JSON (contoh: `address_detail: { desa: "...", kecamatan: "..." }`).
- [ ] **Penghapusan Validasi Payment:** Backend wajib menghapus aturan validasi `payment_method: "cash" | "cashless"` pada saat inisialisasi pesanan, karena pelanggan pada UI Frontend baru akan memilih metode pembayaran *setelah* Admin menetapkan harga.
- [ ] **Validasi Tipe Armada Charter:** Endpoint `POST /api/charter/request` masih membatasi `car_type` secara statis (hanya "Luxio" atau "Elf"). Backend harus merombak ini agar bisa menerima input armada bebas atau ID armada dari database.
- [ ] **Endpoint Penjadwalan Dinamis:** Pembuatan endpoint `POST /api/travel/schedules/availability` untuk mengecek ketersediaan kursi secara massal tanpa memerlukan UUID spesifik sebelumnya.
- [ ] **Endpoint Izin Keberangkatan (Admin Dashboard):** Membuat rute baru `GET /api/admin/dashboard/departure-requests` untuk memvalidasi permintaan tugas supir harian.

### 🔵 Tugas Integrasi Frontend (Modul yang Belum Disentuh)
- [ ] **Modul Area Supir (Driver Dashboard):** Halaman `src/pages/driver/report.astro` belum disinkronisasi. Harus dihubungkan untuk tugas melihat jadwal, merubah status tugas (board/driving), mengajukan biaya operasional bensin/tol (`POST /api/driver/expenses`), dan log perawatan.
- [ ] **Modul Keuangan Admin (Ledger & Cashflow):** Halaman `src/pages/admin/finance.astro` belum diintegrasikan dengan rute `GET /api/admin/cashflow/summary` dan `GET /api/admin/cashflow/transactions`.
- [ ] **Proses "Verify & Assign" (Admin Bookings):** Menambahkan interaksi bagi Admin untuk memverifikasi pembayaran (`PUT /api/travel-bookings/:id/verify`) dan mengatur jadwal penjemputan.
- [ ] **Profil Akun Pengguna / Pengaturan (Opsional):** Jika ada halaman UI untuk pengguna mereset kata sandi atau memperbarui data (Berdasarkan endpoint `/api/auth/reset-password`).
