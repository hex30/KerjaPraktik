# Laporan Integrasi Frontend - Backend (PT Rini Trans Putri)

## Modul Autentikasi - Halaman Login (21 Juni 2026)
- **Endpoint:** `POST /api/auth/login`
- **File Frontend Terubah:** `src/pages/auth/login.astro`, `src/services/authService.ts`, `src/services/api.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Token JWT dan data user berhasil disimpan di localStorage. Telah diimplementasikan Role-Based Access Control (RBAC) untuk mengarahkan pengguna berdasarkan role (Admin, Driver, Customer).

## Modul Autentikasi - Halaman Registrasi (21 Juni 2026)
- **Endpoint:** `POST /api/auth/register`
- **File Frontend Terubah:** `src/pages/auth/login.astro` (Register Form area), `src/services/authService.ts`
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
