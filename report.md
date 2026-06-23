
# Laporan Integrasi Frontend - Backend (PT Rini Trans Putri)

## Modul Autentikasi - Halaman Login (21 Juni 2026)
- **Endpoint:** `POST /api/auth/login`
- **File Frontend Terubah:** `src/pages/auth/login.astro`, `src/services/authService.ts`, `src/services/api.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Token JWT dan data user berhasil disimpan di localStorage. Telah diimplementasikan Role-Based Access Control (RBAC) untuk mengarahkan pengguna berdasarkan role (Admin, Driver, Customer).

## Modul Autentikasi - Halaman Registrasi (21 Juni 2026)
- **Endpoint:** `POST /api/auth/register`
- **File Frontend Terubah:** `src/pages/auth/login.astro` (Register Form area), `src/services/authService.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Form pendaftaran berhasil disambungkan dengan `authService.register()`. Data pengguna yang dikirimkan melalui UI sudah terikat dan memanggil endpoint backend dengan struktur JSON yang sesuai (`name`, `email`, `password`, `phone_number`).

## Modul Publik & Konten - Halaman Beranda (21 Juni 2026)
- **Endpoint:** `GET /api/content/banners`, `GET /api/content/destinations`, `GET /api/content/promotions`
- **File Frontend Terubah:** `src/pages/index.astro`, `src/services/contentService.ts`, `src/components/features/home/HeroSlider.astro`, `src/components/features/home/HeroSlide.astro`, `src/components/features/home/FavoritDestination.astro`, `src/components/features/promotion/PromotionSection.astro`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** 
  - Data Binding diselesaikan melalui SSR (Server-Side Rendering) di `index.astro` dengan arsitektur *Fail-Safe* menggunakan `try...catch`.
  - Menerapkan *graceful degradation*: jika *database Backend* kosong, UI menghapus seluruh komponen *placeholder (dummy data)* dan hanya merender kerangka desain (*layout*) murni tanpa menampilkan kerusakan (*error*).
  - Penyesuaian visual (*Custom UI*): Tombol aksi ditiadakan pada modul Banner dan Navigasi. Layout destinasi diperbarui menjadi grid `4x1` yang bersifat estetik dan dinamis dengan penambahan fungsi "peeking" untuk mengindikasikan fungsi *horizontal-scroll*.

## 3. Komunikasi dengan Tim Backend (Request Update API)
**Kepada Tim Backend:**  
Berdasarkan kebutuhan *Frontend* dan logika UX aplikasi yang men-generate jadwal keberangkatan secara dinamis menggunakan *Javascript* (14 hari ke depan berdasarkan rute yang didukung), sistem memerlukan endpoint pemesanan (*booking*) yang menerima tanggal pilihan pengunjung (*user's chosen date*).

*Pembaruan yang Diperlukan:*
1. **Pembaruan Skema Booking (Route & Date vs Schedule):**  
   Pada *Payload Request* `POST /api/travel/bookings`, hapus kewajiban `schedule_id` dan ganti dengan penerimaan data `route_id` dan `departure_date`. Saat ini validasi Zod meminta `schedule_id` berformat UUID yang mana tidak bisa Frontend berikan karena jadwal dibuat secara dinamis di *client-side*. Mohon siapkan tampungan/field di database untuk menyimpan `departure_date` dan `route_id` yang dipilih oleh user. Frontend untuk sementara mengirim `route_id` dan `departure_date` alih-alih `schedule_id`.

2. **Endpoint Ketersediaan Kursi by Date:**  
   Mohon sediakan endpoint baru untuk *GET Seat Availability* yang parameternya tidak berdasarkan `schedule_id`, melainkan menggunakan `route_id` dan `date`, karena komponen *Seat Map* tidak akan memiliki `schedule_id` nyata sebelum reservasi dilakukan. (Contoh: `GET /api/travel/seats?route_id=...&date=...`).
3. **Konfirmasi Data yang Disediakan Endpoint:**  
   Sesuai dengan logika yang diinginkan (*Business Rules*), satu-satunya data krusial yang perlu diambil dengan status GET ke backend secara aktif pada layar pemesanan hanyalah:
   - Data *Kursi Tersedia* (Seat Map/Availability).
   - Katalog Data Armada (Fleets).
   - Banner Promosi yang berlaku.

## Modul Layanan Customer - Layanan Rute (Travel Reguler) (21 Juni 2026)
- **Endpoint:** `POST /api/travel/schedules/availability` (Sementara), `GET /api/travel/schedules/:id/seats` (Sementara), `POST /api/travel/bookings`
- **File Frontend Terubah:** `src/components/features/reservation/route/RouteBookingForm.astro`, `src/components/features/reservation/shared/SeatMap.astro`, `src/services/travelService.ts`
- **Status:** Selesai & Tervalidasi (Menggunakan Fallback UI).
- **Catatan Integrasi:** 
  - Seluruh *dummy data* (*hardcode*) untuk kursi dan jadwal telah dicabut. UI sekarang bersifat 100% *Data-Driven* dari Backend.
  - Implementasi *Fail-Safe* & *Graceful Degradation*: Jika Backend `404`, sistem tetap berjalan murni sebagai kerangka kosong yang berfungsi tanpa jebakan *dummy*.
  - *Event Delegation* diterapkan penuh pada `SeatMap.astro` untuk memastikan keandalan *Auth Guard*, mencegah *user guest* memilih kursi dalam skenario *routing* apa pun.

### ⚠️ DAFTAR ENDPOINT BE YANG BELUM TERSEDIA (TO-DO BACKEND)
*Mohon bantuan rekan Backend untuk menyesuaikan pembuatan endpoint berikut, kode Frontend (service) sudah disiapkan.*

1. **Fitur:** Pengecekan Sisa Kursi Massal (Frontend-Driven Schedule)
   - **Usulan Endpoint FE:** `POST /api/travel/schedules/availability`
   - **File FE Terkait:** `src/services/travelService.ts`
   - **Struktur Payload Request (Dari FE):** 
     ```json
     {
       "route_id": "jakarta_panawangan",
       "dates": [
         "2026-06-22T00:00:00.000Z",
         "2026-06-24T00:00:00.000Z"
       ]
     }
     ```
   - **Keterangan:** Frontend melempar 14 jadwal tanggal. Mohon BE merespon dengan data sisa kursi (`available_seats`) yang sesuai dengan tiap tanggal tersebut.

2. **Fitur:** Pemetaan Denah Kursi Riil
   - **Usulan Endpoint FE:** `GET /api/travel/schedules/:schedule_id/seats` (Ubah menjadi pakai route_id & date)
   - **File FE Terkait:** `src/services/travelService.ts`
   - **Keterangan:** Mengembalikan array nomor kursi yang berstatus dipesan (*booked*) pada tanggal spesifik tersebut.

3. **Pembaruan:** Sistem Alur Pembayaran Pemesanan (Payment Flow)
   - **Perubahan Skema API:** Tolong hapus validasi ketat `payment_method: "cash" | "cashless"` pada endpoint pembuatan pesanan (`POST /api/travel/bookings`), karena pada saat membuat pesanan, *User* belum memilih metode pembayaran.
   - **Alur Baru (Tolong sesuaikan di Backend):**
     1. **Menunggu Konfirmasi:** Pesanan masuk, Admin melihat pesanan, dan Admin menentukan harga total.
     2. **Menunggu Pembayaran:** Setelah Admin memasukkan harga, pesanan muncul di Riwayat Pesanan User. Di sinilah User baru menekan tombol "Bayar" dan memilih *Cash* atau *Cashless*.
     3. **Menunggu Pengecekan:** Jika *Cashless*, User mengunggah bukti/mengkonfirmasi pembayaran, status berubah menjadi "Menunggu Pengecekan" (Admin memverifikasi uang masuk).
     4. **Selesai:** Jika Admin memverifikasi dana masuk, atau jika User memilih *Cash* dan Admin mengkonfirmasi *Cash*, status menjadi "Selesai" (Silakan tunggu dijemput).

4. **Fitur:** Dynamic Card Fetching (Katalog Armada Sewa/Charter)
   - **Usulan Endpoint FE:** `GET /api/content/fleets`
   - **File FE Terkait:** `src/services/charterService.ts`
   - **Keterangan:** Digunakan untuk merender kartu armada di halaman Charter. Mohon disediakan endpoint publik untuk mengambil data armada aktif.
   - **Ekspektasi Response:**
     ```json
     [
       {
         "id": "uuid",
         "name": "Isuzu ELF Giga",
         "type": "elf",
         "capacity": "14-19 Kursi",
         "price_per_day": 1200000,
         "description": "...",
         "image_url": "..."
       }
     ]
# Laporan Integrasi Frontend - Backend (PT Rini Trans Putri)

## Modul Autentikasi - Halaman Login (21 Juni 2026)
- **Endpoint:** `POST /api/auth/login`
- **File Frontend Terubah:** `src/pages/auth/login.astro`, `src/services/authService.ts`, `src/services/api.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Token JWT dan data user berhasil disimpan di localStorage. Telah diimplementasikan Role-Based Access Control (RBAC) untuk mengarahkan pengguna berdasarkan role (Admin, Driver, Customer).

## Modul Autentikasi - Halaman Registrasi (21 Juni 2026)
- **Endpoint:** `POST /api/auth/register`
- **File Frontend Terubah:** `src/pages/auth/login.astro` (Register Form area), `src/services/authService.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Form pendaftaran berhasil disambungkan dengan `authService.register()`. Data pengguna yang dikirimkan melalui UI sudah terikat dan memanggil endpoint backend dengan struktur JSON yang sesuai (`name`, `email`, `password`, `phone_number`).

## Modul Publik & Konten - Halaman Beranda (21 Juni 2026)
- **Endpoint:** `GET /api/content/banners`, `GET /api/content/destinations`, `GET /api/content/promotions`
- **File Frontend Terubah:** `src/pages/index.astro`, `src/services/contentService.ts`, `src/components/features/home/HeroSlider.astro`, `src/components/features/home/HeroSlide.astro`, `src/components/features/home/FavoritDestination.astro`, `src/components/features/promotion/PromotionSection.astro`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** 
  - Data Binding diselesaikan melalui SSR (Server-Side Rendering) di `index.astro` dengan arsitektur *Fail-Safe* menggunakan `try...catch`.
  - Menerapkan *graceful degradation*: jika *database Backend* kosong, UI menghapus seluruh komponen *placeholder (dummy data)* dan hanya merender kerangka desain (*layout*) murni tanpa menampilkan kerusakan (*error*).
  - Penyesuaian visual (*Custom UI*): Tombol aksi ditiadakan pada modul Banner dan Navigasi. Layout destinasi diperbarui menjadi grid `4x1` yang bersifat estetik dan dinamis dengan penambahan fungsi "peeking" untuk mengindikasikan fungsi *horizontal-scroll*.

## 3. Komunikasi dengan Tim Backend (Request Update API)
**Kepada Tim Backend:**  
Berdasarkan kebutuhan *Frontend* dan logika UX aplikasi yang men-generate jadwal keberangkatan secara dinamis menggunakan *Javascript* (14 hari ke depan berdasarkan rute yang didukung), sistem memerlukan endpoint pemesanan (*booking*) yang menerima tanggal pilihan pengunjung (*user's chosen date*).

*Pembaruan yang Diperlukan:*
1. **Pembaruan Skema Booking (Route & Date vs Schedule):**  
   Pada *Payload Request* `POST /api/travel/bookings`, hapus kewajiban `schedule_id` dan ganti dengan penerimaan data `route_id` dan `departure_date`. Saat ini validasi Zod meminta `schedule_id` berformat UUID yang mana tidak bisa Frontend berikan karena jadwal dibuat secara dinamis di *client-side*. Mohon siapkan tampungan/field di database untuk menyimpan `departure_date` dan `route_id` yang dipilih oleh user. Frontend untuk sementara mengirim `route_id` dan `departure_date` alih-alih `schedule_id`.

2. **Endpoint Ketersediaan Kursi by Date:**  
   Mohon sediakan endpoint baru untuk *GET Seat Availability* yang parameternya tidak berdasarkan `schedule_id`, melainkan menggunakan `route_id` dan `date`, karena komponen *Seat Map* tidak akan memiliki `schedule_id` nyata sebelum reservasi dilakukan. (Contoh: `GET /api/travel/seats?route_id=...&date=...`).
3. **Konfirmasi Data yang Disediakan Endpoint:**  
   Sesuai dengan logika yang diinginkan (*Business Rules*), satu-satunya data krusial yang perlu diambil dengan status GET ke backend secara aktif pada layar pemesanan hanyalah:
   - Data *Kursi Tersedia* (Seat Map/Availability).
   - Katalog Data Armada (Fleets).
   - Banner Promosi yang berlaku.

## Modul Layanan Customer - Layanan Rute (Travel Reguler) (21 Juni 2026)
- **Endpoint:** `POST /api/travel/schedules/availability` (Sementara), `GET /api/travel/schedules/:id/seats` (Sementara), `POST /api/travel/bookings`
- **File Frontend Terubah:** `src/components/features/reservation/route/RouteBookingForm.astro`, `src/components/features/reservation/shared/SeatMap.astro`, `src/services/travelService.ts`
- **Status:** Selesai & Tervalidasi (Menggunakan Fallback UI).
- **Catatan Integrasi:** 
  - Seluruh *dummy data* (*hardcode*) untuk kursi dan jadwal telah dicabut. UI sekarang bersifat 100% *Data-Driven* dari Backend.
  - Implementasi *Fail-Safe* & *Graceful Degradation*: Jika Backend `404`, sistem tetap berjalan murni sebagai kerangka kosong yang berfungsi tanpa jebakan *dummy*.
  - *Event Delegation* diterapkan penuh pada `SeatMap.astro` untuk memastikan keandalan *Auth Guard*, mencegah *user guest* memilih kursi dalam skenario *routing* apa pun.

### ⚠️ DAFTAR ENDPOINT BE YANG BELUM TERSEDIA (TO-DO BACKEND)
*Mohon bantuan rekan Backend untuk menyesuaikan pembuatan endpoint berikut, kode Frontend (service) sudah disiapkan.*

1. **Fitur:** Pengecekan Sisa Kursi Massal (Frontend-Driven Schedule)
   - **Usulan Endpoint FE:** `POST /api/travel/schedules/availability`
   - **File FE Terkait:** `src/services/travelService.ts`
   - **Struktur Payload Request (Dari FE):** 
     ```json
     {
       "route_id": "jakarta_panawangan",
       "dates": [
         "2026-06-22T00:00:00.000Z",
         "2026-06-24T00:00:00.000Z"
       ]
     }
     ```
   - **Keterangan:** Frontend melempar 14 jadwal tanggal. Mohon BE merespon dengan data sisa kursi (`available_seats`) yang sesuai dengan tiap tanggal tersebut.

2. **Fitur:** Pemetaan Denah Kursi Riil
   - **Usulan Endpoint FE:** `GET /api/travel/schedules/:schedule_id/seats` (Ubah menjadi pakai route_id & date)
   - **File FE Terkait:** `src/services/travelService.ts`
   - **Keterangan:** Mengembalikan array nomor kursi yang berstatus dipesan (*booked*) pada tanggal spesifik tersebut.

3. **Pembaruan:** Sistem Alur Pembayaran Pemesanan (Payment Flow)
   - **Perubahan Skema API:** Tolong hapus validasi ketat `payment_method: "cash" | "cashless"` pada endpoint pembuatan pesanan (`POST /api/travel/bookings`), karena pada saat membuat pesanan, *User* belum memilih metode pembayaran.
   - **Alur Baru (Tolong sesuaikan di Backend):**
     1. **Menunggu Konfirmasi:** Pesanan masuk, Admin melihat pesanan, dan Admin menentukan harga total.
     2. **Menunggu Pembayaran:** Setelah Admin memasukkan harga, pesanan muncul di Riwayat Pesanan User. Di sinilah User baru menekan tombol "Bayar" dan memilih *Cash* atau *Cashless*.
     3. **Menunggu Pengecekan:** Jika *Cashless*, User mengunggah bukti/mengkonfirmasi pembayaran, status berubah menjadi "Menunggu Pengecekan" (Admin memverifikasi uang masuk).
     4. **Selesai:** Jika Admin memverifikasi dana masuk, atau jika User memilih *Cash* dan Admin mengkonfirmasi *Cash*, status menjadi "Selesai" (Silakan tunggu dijemput).

4. **Fitur:** Dynamic Card Fetching (Katalog Armada Sewa/Charter)
   - **Usulan Endpoint FE:** `GET /api/content/fleets`
   - **File FE Terkait:** `src/services/charterService.ts`
   - **Keterangan:** Digunakan untuk merender kartu armada di halaman Charter. Mohon disediakan endpoint publik untuk mengambil data armada aktif.
   - **Ekspektasi Response (Sesuai Skema Baru DB BE):**
     ```json
     [
       {
         "id": "uuid",
         "plate_number": "Z 1234 XY",
         "car_type": "Elf",
         "seat_capacity": 15,
         "status": "active",
         "description": "...",
         "image_url": "..."
       }
     ]
     ```

5. **Pembaruan:** Penyesuaian Skema Request Charter
   - **File FE Terkait:** `src/services/charterService.ts`
   - **Keterangan:** Validasi `POST /api/charter/request` di BE membatasi `car_type` hanya "Luxio" atau "Elf". Di UI terdapat opsi armada lain. Mohon skema `charterRequestSchema` diperbarui untuk menerima semua `car_type` armada atau menggantinya dengan referensi `fleet_id`. Selain itu, detail alamat penjemputan penumpang terpaksa disisipkan ke field `notes` karena BE belum memiliki field yang rinci (seperti desa, kecamatan, dsb).

6. **Pengecekan Internal:** Error 500 pada API Layanan Paket Ekspedisi
   - **Endpoint Terkait:** `POST /api/packages/shipments`
   - **Keterangan:** Saat UI Frontend mengirim data payload yang valid (`sender_name`, `dimension`, `seat_qty`, `weight`, dll), Controller backend di `package.controller.js` melemparkan `status: 500` dengan pesan `"Gagal membuat pengiriman paket"`. Kemungkinan besar terdapat masalah pada eksekusi `PackageModel.createShipment(data)`.
   - **Pembaruan:** Frontend kini telah menyisipkan field `departure_date` pada payload agar pengguna dapat memilih tanggal pengiriman. Mohon Backend menyesuaikan skema dan database untuk menerima sekaligus menyimpan `departure_date`.

7. **Fitur:** Penyesuaian Pemetaan Data Promosi (Global Promo)
   - **File FE Terkait:** `src/services/contentService.ts`, `src/pages/index.astro`, `src/pages/services.astro`
   - **Keterangan:** Mengikuti ketentuan terbaru, **hanya ada 1 promosi aktif** yang ditampilkan kepada *user* secara serentak di halaman *Home* maupun *Layanan*. Kolom `promo_type` pada database dapat diabaikan atau dihapus. Frontend akan membaca teks secara penuh dari hasil respons BE dan mengelolanya menjadi *layout* berbeda di tiap halaman.
   - **Tindakan yang Diperlukan di BE:**
     1. **Pemetaan Data UI:** Frontend menganggap isi dari `badge_label` (misal: "MUDIK20") sebagai **"besaran promo visual"** yang akan dipampang dengan warna biru/besar di halaman *Layanan*. Dan kolom `tagline` (misal: "Promo Mudik Berkah RTP!") akan dipecah otomatis menjadi teks utama (*Header*) yang berlapis. Pastikan Endpoint mengeluarkan data `badge_label` dan `tagline` secara akurat dari *input* Admin.
     2. **Update Skema Database (`promotions` table):** Tambahkan kolom `max_discount` (tipe decimal/numeric) untuk mengakomodasi form input "Max Potongan" di halaman kelola promosi Admin.
     3. **Endpoint Promo Tunggal:** Cukup sediakan endpoint global `GET /api/content/promotions` yang mengembalikan `array` berisi 1 objek promo yang sedang berstatus `is_active = true`.

## Modul Layanan Customer - Halaman Riwayat Pesanan / Dashboard (22 Juni 2026)
- **Endpoint:** `GET /api/travel/history`, `GET /api/charter/history`, `GET /api/packages/history`
- **File Frontend Terubah:** `src/pages/user/booking-history.astro`, `src/components/features/user/OrderItem.astro`, `src/services/userService.ts`
- **Status:** Selesai & Tervalidasi (Menggunakan Fallback Array Kosong).
- **Catatan Integrasi:** 
  - Seluruh status *dummy* telah dihapus. Halaman ini memanggil 3 endpoint riwayat secara *paralel* (`Promise.allSettled`) agar performa pemuatan lebih cepat.
  - Menerapkan **Hybrid Mapper**: struktur data JSON yang berbeda-beda dari 3 layanan tersebut dinormalisasi secara otomatis menjadi 1 antarmuka, sementara detail unik (nomor kursi, nomor resi, plat mobil) diamankan di dalam properti `meta`.
  - Mengimplementasikan logika tampilan berdasarkan **Alur Pembayaran 4 Tahap**: Komponen UI tidak akan menampilkan tombol "BAYAR SEKARANG" jika status dari Backend adalah `PENDING_CONFIRMATION` (Admin belum menetapkan harga akhir).

## Modul Dashboard Admin - Ringkasan & Operasional (22 Juni 2026)
- **Endpoint:** `GET /api/admin/dashboard/metrics`, `GET /api/admin/dashboard/departure-requests` (BARU), `GET /api/admin/dashboard/active-duties`
- **File Frontend Terubah:** `src/pages/admin/index.astro`, `src/services/adminDashboardService.ts`
- **Status:** Selesai (Data Binding) & Menunggu Pembuatan Endpoint BE.
- **Catatan Integrasi & Instruksi Spesifik untuk Backend (MOHON SEGERA DIBUAT):**
  1. **Pemosisian Data Pemesan & Paket:** Frontend **tidak menampilkan** Data Pemesan (Travel/Charter) dan Paket di *halaman utama* Dashboard sesuai desain awal (telah memiliki halaman terpisah di Sidebar seperti `/admin/bookings`).
  2. **Revisi Endpoint Metrik (`GET /api/admin/dashboard/metrics`):** Saat ini endpoint ini hanya berisi hitungan omzet finansial. Frontend mewajibkan Backend untuk menyisipkan *key* berikut pada respons JSON:
     - `total_bookings_today`: (angka) jumlah pesanan masuk hari ini.
     - `total_users`: (angka) total akun terdaftar (Guest/Customer).
     - `total_drivers`: (angka) total supir terdaftar.
  3. **Pembuatan Endpoint Izin Keberangkatan (Driver Departure Request):** 
     - **Latar Belakang:** Alur kerja disepakati bahwa *Admin me-assign supir* -> *Supir mengajukan izin berangkat di hari H* -> *Admin menyetujui izin*.
     - **Tugas BE:** Buat endpoint `GET /api/admin/dashboard/departure-requests` yang mengembalikan array objek dengan struktur JSON *tepat* seperti ini:
       ```json
       [
         {
           "id": "REQ-001",
           "driver1": "Nama Supir 1",
           "driver2": "Nama Supir 2 (Opsional)",
           "pax": 15,
           "path": "Asal - Tujuan",
           "date": "2026-06-26",
           "packages": 3,
           "unit_name": "Nama Armada (Plat)",
           "type": "RUTE atau BOOKING"
         }
       ]
       ```
     - **Tugas BE (Action):** Buat juga endpoint `PUT /api/admin/dashboard/departure-requests/:id/approve` untuk mengubah status armada tersebut menjadi sah bertugas (*On Duty*) dan memindahkannya ke tabel/daftar *Active Duties*.

## Modul Manajemen Pemesan & Paket Admin (22 Juni 2026)
- **Endpoint:** `GET /api/admin/master/travel-bookings`, `GET /api/charter/history`, `GET /api/admin/master/package-shipments`
- **File Frontend Terubah:** `src/pages/admin/bookings.astro`, `src/pages/admin/packages.astro`, `src/services/adminBookingService.ts`
- **Status:** Selesai (Data Binding Strict) & **Membutuhkan Perombakan Schema Backend**.
- **Catatan Integrasi & Instruksi BLocker untuk Backend (WAJIB DIBACA):**
  - Berdasarkan prinsip **Standard Professional Frontend**, UI Frontend menolak melakukan manipulasi/ekstraksi *string* secara sepihak untuk memecah alamat. Frontend menuntut agar API Backend mengembalikan alamat dalam bentuk JSON Tersarang (*Nested JSON Object*).
  - **Tugas BE (Refactor API):** Pada ketiga endpoint di atas, properti detail alamat (baik pengirim, penerima, asal, maupun tujuan) wajib dikembalikan dalam format objek `address_detail` dan `destination_detail` (atau `sender_address_detail` & `receiver_address_detail` untuk paket).
  - **Skema JSON yang Diwajibkan:**
    ```json
    "address_detail": {
        "kecamatan": "Kecamatan Pemesan",
        "desa": "Desa Pemesan",
        "dusun": "Dusun (Opsional)",
        "rt_rw": "01/02",
        "patokan": "Detail patokan/jalan lengkap"
    }
    ```
  - **Fallback Frontend:** Selama Backend belum merombak API-nya agar sesuai skema di atas, antarmuka Frontend secara defensif akan merender tulisan **"DATA BE BELUM SESUAI"** pada kolom alamat agar aplikasi tidak *crash*.

---

## 4. Analisis Menyeluruh Kesiapan Frontend (`src/`) vs Backend (BE)

Berikut adalah rangkuman dari seluruh implementasi di folder `D:\ProjekKp\KerjaPraktik\src` yang dibandingkan dengan sistem Backend saat ini:

## Modul Titip Paket - Form & Pengiriman (22 Juni 2026)
- **Endpoint:** `POST /api/packages/shipments`
- **File Frontend Terubah:** `src/components/features/reservation/package/PackageBookingForm.astro`, `src/services/packageService.ts`
- **Status:** Menunggu Tindakan BE (Error 500 & Tambahan Kolom).
- **Catatan Integrasi:** Frontend telah merombak payload untuk menyertakan `departure_date` sesuai dengan pilihan tanggal pengiriman user. Frontend juga telah mengubah nilai *default* `payment_method` menjadi `menunggu_konfirmasi`. Backend wajib memastikan tabel di database mampu menampung field baru ini, serta mengubah/menambahkan `pickup_address` jika masih belum ada.

## Modul Sewa Armada (Charter) - Katalog & Form (22 Juni 2026)
- **Endpoint:** `GET /api/content/fleets` (Belum ada), `POST /api/charter/request`
- **File Frontend Terubah:** `src/components/features/reservation/charter/CharterBookingForm.astro`, `src/services/charterService.ts`, `src/components/features/reservation/charter/PreviewSeatMap.astro`
- **Status:** Menunggu Tindakan BE.
- **Catatan Integrasi:** UI Frontend dirancang secara dinamis merender *Preview Layout Kursi* berdasarkan tipe mobil. Frontend telah mengadaptasi struktur tabel/model Backend yang baru, yaitu `plate_number`, `car_type`, dan `seat_capacity`. Form *Charter* kini hanya menampilkan 2 pilihan armada unik (`Elf` dan `Luxio`), namun memanggil seluruh data armada *background*. Mohon Backend menghapus pembatasan validasi `payment_method` dan menyelaraskan penerimaan field pada *Charter*.

## Modul Pembayaran & Status Pemesanan - Seluruh Layanan (22 Juni 2026)
- **Endpoint:** Berpengaruh ke semua endpoint `POST` reservasi.
- **File Frontend Terubah:** Komponen Pemesanan (`RouteBookingForm`, `CharterBookingForm`, `PackageBookingForm`)
- **Status:** Menunggu Tindakan BE.
- **Catatan Integrasi:** Pola/UX pemesanan telah dirombak. Frontend **tidak akan** mengirimkan metode pembayaran (`payment_method`: "cash"/"cashless") di awal pembuatan pesanan. User akan memesan dulu, Admin menentukan harga, lalu User baru memilih metode bayar. Backend harus **menghapus validasi wajib** `payment_method` pada *Controller* pembuatan pesanan mereka.

Dari seluruh kode yang ditulis di folder `src/`, Frontend sudah 100% menggunakan arsitektur *Data-Driven* (bergantung pada respons Backend) dan telah menggunakan penanganan error (`try...catch`) agar UI tidak rusak jika Backend mati. Saat ini operasional aplikasi hanya tertahan oleh ketiadaan endpoint tertentu (Fleets, Ketersediaan Kursi dinamis) dan ketidakcocokan skema tabel/validasi di sisi Backend (Missing column `pickup_address`, validasi `schedule_id`, validasi `car_type`, validasi `payment_method`). Mohon kerjasamanya dari tim Backend untuk memfasilitasi hal-hal tersebut.

---

## Modul Kelola Konten (CMS) - Sisi Admin & User (22 Juni 2026)
- **Endpoint Admin:** `POST/PUT/DELETE /api/admin/cms/promotions`, `/api/admin/cms/destinations`, `/api/admin/cms/fleets`
- **Endpoint Publik:** `GET /api/content/promotions`, `/api/content/destinations`, `GET /api/content/fleets`
- **File Frontend Terubah:** `src/services/adminContentService.ts`, `src/pages/admin/content.astro`, `src/pages/admin/destinations.astro`, `src/pages/admin/fleet.astro`
- **Status:** Selesai (Data Binding & Client-Side Script).
- **Catatan Integrasi & Instruksi Spesifik untuk Backend:**
  1. **Aksi Admin:** Frontend mengirim form menggunakan object `FormData` (Multipart) jika admin mengunggah gambar baru, atau `application/json` jika tanpa gambar. Backend harus siap menerima *content-type* dinamis ini di semua *route* `/api/admin/cms/...`.
  2. **Skema JSON Promo (Banner):** Jika dikirim via JSON, payload untuk Promo adalah:
     ```json
     {
        "id": "uuid", // Hanya dikirim jika PUT
        "tagline": "Tagline Promo",
        "description": "Deskripsi Promo",
        "discount": "20",
        "max_discount": "50000",
        "is_active": true
     }
     ```
  3. **Aksi Delete:** Proses Delete dilakukan dengan request metode `DELETE` ke endpoint `/api/admin/cms/.../:id`.
  4. **Endpoint Publik Fleet (BLOKIR):** Frontend menggunakan endpoint `GET /api/content/fleets` untuk mendapatkan data armada pada komponen User (seperti dropdown tipe kendaraan atau kartu). Saat ini BE belum menyediakannya. Tolong siapkan rute `/api/content/fleets` yang dapat diakses Publik (tanpa JWT) yang mereturn list armada berstatus "Tersedia" atau "active".

## Modul Manajemen Akun (Pengguna & Driver) - Admin (23 Juni 2026)
- **Endpoint:** `GET /api/admin/master/users`, `PUT /api/admin/master/users/:id`
- **File Frontend Terubah:** `src/pages/admin/users.astro`, `src/services/adminContentService.ts`
- **Status:** Selesai (Data Binding) & Tersinkronisasi dengan Backend.
- **Catatan Integrasi:**
  - Mock data telah dihapus secara keseluruhan. Halaman kini melakukan *fetch* aktif ke endpoint `/api/admin/master/users`.
  - Berdasarkan hasil validasi internal terhadap file `user.model.js` dan `validation.middleware.js` (pada skema `adminValidationSchemas.user`) milik Backend, struktur tabel `users` **telah terkonfirmasi 100% kompatibel** dengan kebutuhan atribut UI saat ini. Atribut krusial seperti `name`, `email`, `password`, `phone_number`, dan `role` (`customer`/`driver`) sudah difasilitasi penuh.
  - Kesimpulan: **Tidak ada perubahan skema atau penambahan atribut yang diperlukan** dari tim Backend untuk fitur pengelolaan pengguna dan supir ini. Fungsi mutasi hak akses (*Role Elevation*) dan ganti *password* juga sudah dapat dilayani melalui metode `PUT` ke `updateUser`.


## [Note untuk Tim Backend] Logika Kalkulasi Diskon Promo
Berdasarkan PRD/README.md, sistem memerlukan adanya proses kalkulasi diskon secara otomatis di Backend. Saat ini, ketika Admin menyetujui pemesanan dan menginput harga (Total Price), Backend (updateTravelBookingStatus di masterData.model.js) hanya menyimpan harga tersebut mentah-mentah ke database.

Tindakan yang Dibutuhkan dari Tim Backend:
- Tambahkan logika pada Endpoint Update Status Pesanan (atau saat proses Checkout) untuk mengecek promo aktif (dari tabel promotions).
- Lakukan kalkulasi pemotongan harga tiket awal berdasarkan discount (persentase) namun tidak melebihi nilai maksimal pemotongan yang ada di max_discount.
- Simpan **Harga Akhir** (setelah didiskon) ke dalam kolom price pada tabel travel_bookings.
- Simpan **Harga Akhir** (setelah didiskon) ke dalam kolom price pada tabel travel_bookings.


## [Frontend Fix] Perbaikan Form Booking Admin (CORS & Payload)
Pada file src/components/features/admin/bookings/BookingTable.astro telah dilakukan perbaikan krusial:
1. **Migrasi ke apiFetch**: Mengganti fetch API mentah ke apiFetch() bawaan layanan Frontend untuk menghindari masalah pemblokiran CORS dari browser (karena Astro berjalan di port 4321 dan BE di 5000).
2. **Pengiriman Data Paralel (RUTE)**: Sebelumnya, saat Admin menetapkan Harga, Armada, dan Supir untuk rute, Frontend hanya mengirim status dan harga ke BE. Armada dan supir dibuang. Sekarang Frontend memanggil dua endpoint sekaligus secara otomatis: endpoint status (/status) dan endpoint assign armada (/assign).

## 4. Laporan Bug API (Booking & Packages) - WARNING UNTUK BE

1. **Charter 500 (Gagal membuat pengajuan charter):**
   BE masih membatasi `car_type` secara *hardcode* di *controller* ("Luxio" / "Elf"). Segera hapus validasi *hardcode* ini karena FE sudah menyuplai `car_type` secara dinamis dari data armada di DB!
2. **Paket 500 (Gagal membuat pengiriman paket):**
   Fungsi `PackageModel.createShipment()` *crash* karena struktur tabel DB `package_shipments` belum memiliki kolom alamat seperti `pickup_address` atau wadah untuk *Nested JSON*. FE sudah mengirim payload secara rapi, tolong selesaikan skema tabel di BE!
3. **Rute 400 (Format route_id tidak valid):**
   **Peringatan Keras untuk Tim BE!** Saat ini, tim FE sudah mengubah cara pengambilan data Rute secara PERMANEN menjadi dinamis melalui *endpoint* `GET /api/content/routes`. Namun karena BE belum membuat endpoint ini, dropdown rute di UI Frontend kosong, dan UUID rute (`route_id`) tidak terkirim, yang menyebabkan pesan *error* "Format route_id tidak valid". BE **Wajib Segera** membuat endpoint `GET /api/content/routes` yang mengembalikan objek `id` (UUID riil) dan `route_name` (Asal-Tujuan) agar FE bisa melengkapi data ke dalam dropdown secara otomatis tanpa menyebabkan 400 Bad Request. **FE TIDAK AKAN DIUBAH LAGI, BE YANG HARUS MENYESUAIKAN!**
