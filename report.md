
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
     ```

5. **Pembaruan:** Penyesuaian Skema Request Charter
   - **File FE Terkait:** `src/services/charterService.ts`
   - **Keterangan:** Validasi `POST /api/charter/request` di BE membatasi `car_type` hanya "Luxio" atau "Elf". Di UI terdapat opsi armada lain. Mohon skema `charterRequestSchema` diperbarui untuk menerima semua `car_type` armada atau menggantinya dengan referensi `fleet_id`. Selain itu, detail alamat penjemputan penumpang terpaksa disisipkan ke field `notes` karena BE belum memiliki field yang rinci (seperti desa, kecamatan, dsb).

6. **Pengecekan Internal:** Error 500 pada API Layanan Paket Ekspedisi
   - **Endpoint Terkait:** `POST /api/packages/shipments`
   - **Keterangan:** Saat UI Frontend mengirim data payload yang valid (`sender_name`, `dimension`, `seat_qty`, `weight`, dll), Controller backend di `package.controller.js` melemparkan `status: 500` dengan pesan `"Gagal membuat pengiriman paket"`. Kemungkinan besar terdapat masalah pada eksekusi `PackageModel.createShipment(data)`, seperti *PostgreSQL connection leak*, tabel belum tersedia, atau trigger `trg_generate_waybill` bermasalah. Mohon dicek.

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

---

## 4. Analisis Menyeluruh Kesiapan Frontend (`src/`) vs Backend (BE)

Berikut adalah rangkuman dari seluruh implementasi di folder `D:\ProjekKp\KerjaPraktik\src` yang dibandingkan dengan sistem Backend saat ini:

## Modul Titip Paket - Form & Pengiriman (22 Juni 2026)
- **Endpoint:** `POST /api/packages/shipments`
- **File Frontend Terubah:** `src/components/features/reservation/package/PackageBookingForm.astro`, `src/services/packageService.ts`
- **Status:** Menunggu Tindakan BE (Error 500).
- **Catatan Integrasi:** Frontend telah selesai menerapkan validasi data dan pengikatan fungsi untuk pengiriman form. Saat form dikirim, Backend merespons dengan *Error 500*. Analisis menunjukkan bahwa Backend tidak memiliki kolom `pickup_address` di tabel `package_shipments`. Backend harus menambahkan kolom ini agar Frontend dapat berjalan penuh.

## Modul Sewa Armada (Charter) - Katalog & Form (22 Juni 2026)
- **Endpoint:** `GET /api/content/fleets` (Belum ada), `POST /api/charter/request`
- **File Frontend Terubah:** `src/components/features/reservation/charter/CharterBookingForm.astro`, `src/services/charterService.ts`
- **Status:** Menunggu Tindakan BE.
- **Catatan Integrasi:** UI Frontend dirancang secara dinamis untuk menampilkan gambar dan kapasitas armada dari database. Namun, Backend belum memiliki endpoint `GET /api/content/fleets` untuk Frontend memanggil data tersebut. Pada proses pengiriman data sewa, Backend membatasi `car_type` secara kaku (hanya Luxio/Elf), mohon Backend menghapus pembatasan validasi tersebut.

## Modul Pembayaran & Status Pemesanan - Seluruh Layanan (22 Juni 2026)
- **Endpoint:** Berpengaruh ke semua endpoint `POST` reservasi.
- **File Frontend Terubah:** Komponen Pemesanan (`RouteBookingForm`, `CharterBookingForm`, `PackageBookingForm`)
- **Status:** Menunggu Tindakan BE.
- **Catatan Integrasi:** Pola/UX pemesanan telah dirombak. Frontend **tidak akan** mengirimkan metode pembayaran (`payment_method`: "cash"/"cashless") di awal pembuatan pesanan. User akan memesan dulu, Admin menentukan harga, lalu User baru memilih metode bayar. Backend harus **menghapus validasi wajib** `payment_method` pada *Controller* pembuatan pesanan mereka.

## Kesimpulan Analisis
Dari seluruh kode yang ditulis di folder `src/`, Frontend sudah 100% menggunakan arsitektur *Data-Driven* (bergantung pada respons Backend) dan telah menggunakan penanganan error (`try...catch`) agar UI tidak rusak jika Backend mati. Saat ini operasional aplikasi hanya tertahan oleh ketiadaan endpoint tertentu (Fleets, Ketersediaan Kursi dinamis) dan ketidakcocokan skema tabel/validasi di sisi Backend (Missing column `pickup_address`, validasi `schedule_id`, validasi `car_type`, validasi `payment_method`). Mohon kerjasamanya dari tim Backend untuk memfasilitasi hal-hal tersebut.
