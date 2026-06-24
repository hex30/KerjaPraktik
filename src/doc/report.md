# Laporan Kebutuhan Integrasi Backend (BE) berdasarkan Frontend (FE)

Dokumen ini memuat **Daftar Keseluruhan Endpoint** yang saat ini aktif dipanggil oleh Frontend (FE), beserta **Logika & Proses** yang *wajib* diimplementasikan di Backend (BE). Prinsip utamanya adalah: **Frontend hanya bertugas menarik dan menampilkan data (Dummy/Client-logic dihapus), sementara seluruh logika, perhitungan, dan penguncian data diproses murni oleh Backend.**

---

## 1. Daftar Keseluruhan Endpoint FE & Status Kebutuhan BE

Berikut adalah semua endpoint yang digunakan FE. Tanda ⚠️ menunjukkan endpoint tersebut membutuhkan penyesuaian logika di BE, dan ❌ menunjukkan endpoint sama sekali belum ada di BE.

### A. Autentikasi (Auth)
- `POST /api/auth/register` (Menyimpan data pendaftaran)
- `POST /api/auth/login` (Memvalidasi dan mengembalikan JWT Token)

### B. Konten Publik (CMS)
- `GET /api/content/routes` (Katalog rute)
- `GET /api/content/banners` (Gambar banner carousel)
- `GET /api/content/destinations` (Katalog destinasi wisata)
- `GET /api/content/promotions` (Katalog diskon aktif)
- ❌ **`GET /api/content/fleets`** (Katalog armada publik untuk Charter - *Belum Ada di BE*)

### C. Travel Reguler
- `GET /api/travel/schedules` (Mencari jadwal)
- ⚠️ **`POST /api/travel/bookings`** (Membuat pesanan travel - *Butuh perombakan logika jadwal dinamis*)
- `POST /api/travel/bookings/:id/payment-proof` (Unggah bukti bayar reguler)
- ❌ **`GET /api/travel/seats`** (Mengambil data kursi yang sudah dipesan/terkunci - *Belum Ada di BE*)

### D. Charter Pariwisata
- ⚠️ **`POST /api/charter/request`** (Membuat pesanan sewa mobil - *Butuh pelonggaran validasi*)
- `POST /api/charter/request/:id/payment-proof` (Unggah bukti bayar charter)

### E. Pengiriman Paket
- ⚠️ **`POST /api/packages/shipments`** (Membuat pesanan paket - *Butuh penambahan field tanggal*)

### F. Riwayat Pesanan Customer (User History)
- `GET /api/travel/history`
- `GET /api/charter/history`
- `GET /api/packages/history`

### G. Dasbor & Operasional Admin
- ⚠️ **`GET /api/admin/dashboard/metrics`** (Statistik dasbor - *Butuh mapping nama keys JSON*)
- ❌ **`GET /api/admin/dashboard/departure-requests`** (Daftar armada yang sedang bertugas/request berangkat - *Belum Ada di BE*)
- ❌ **`PUT /api/admin/dashboard/departure-requests/:id/approve`** (Aksi ACC supir berangkat - *Belum Ada di BE*)

### H. Master Data Admin (Tabel & CRUD)
- ⚠️ **`GET /api/admin/master/travel-bookings`** (Tabel Pesanan Travel - *BE harus bisa membaca JSON alamat bersarang*)
- `GET /api/admin/master/package-shipments` (Tabel Pesanan Paket)
- `GET /api/admin/master/fleets` (Tabel Armada)
- `GET /api/admin/master/users` (Tabel Pelanggan/Karyawan)
- `GET /api/admin/master/schedules` (Tabel Jadwal)
- `PUT /api/admin/master/schedules/:id/assign` (Aksi Admin menetapkan mobil & supir ke jadwal)
- `PUT /api/admin/master/travel-bookings/:id/verify` (Verifikasi pembayaran tiket)
- `PUT /api/admin/master/travel-bookings/:id/status` (Ubah status perjalanan)

### I. Manajemen Konten Admin (PUT/POST CMS)
- ⚠️ **`POST / PUT /api/admin/cms/promotions`** (*Butuh perbaikan PK Collision & Multer Form-Data*)
- ⚠️ **`POST / PUT /api/admin/cms/destinations`** (*Butuh perbaikan PK Collision & Multer Form-Data*)
- ⚠️ **`POST / PUT /api/admin/master/fleets`** (*Butuh perbaikan PK Collision & Multer Form-Data*)

---

## 2. Detail Logika & Proses yang HARUS Dibuat/Diolah di BE

Agar Frontend bisa murni bertindak sebagai "Penarik Data" (*Dumb Component* yang hanya me-render response), Backend harus mengambil alih dan memperbaiki logika pemrosesan berikut:

### A. Pemrosesan "Jadwal Harian Dinamis" & Penguncian Kursi (Travel Reguler)
- **Logika di BE:** 
  1. Frontend mengirimkan `route_id` dan `departure_date`.
  2. BE membuang validasi *Zod* yang memaksa adanya `schedule_id` dan *enum* `payment_method`.
  3. Saat request masuk, **BE bertugas secara otomatis membuat baris jadwal baru** di tabel `schedules` untuk rute dan tanggal tersebut (jika belum ada).
  4. Setelah jadwal didapat, **BE mengunci kursi** yang dipilih ke tabel `travel_bookings`.
  5. BE merespons *request* `/api/travel/seats?route_id=...&date=...` dengan *Array* berisi nomor-nomor kursi yang sudah dikunci oleh pengguna lain. FE hanya tinggal membaca *Array* ini untuk menghitamkan kursi di layar.

### B. Pelonggaran Skema Validasi (Charter & Paket)
- **Logika di BE:** 
  1. Untuk Charter: Cabut validasi ketat *enum* `car_type` (seperti hanya membolehkan "Luxio" atau "Elf") di `charterRequestSchema`, karena Frontend mengirimkan opsi armada dinamis dari database.
  2. Untuk Paket: Tambahkan validasi penerimaan atribut `departure_date` di `packageShipmentSchema` agar BE tidak menolak data form paket dari FE.

### C. Pemrosesan Data Dashboard Admin (Metrics & Approval)
- **Logika di BE:**
  1. Pada endpoint *Metrics*, BE bertugas menghitung dan menamai ulang responsenya agar **tepat** memiliki *keys*: `total_users`, `total_drivers`, dan `total_bookings_today`. Jika BE menggunakan nama variabel lain (misal: `userCount`), FE tidak akan memunculkan datanya.
  2. BE bertugas menyediakan tabel/relasi khusus untuk menampung *Departure Requests* (Permintaan keberangkatan dari Supir) yang bisa ditarik dan di-*approve* secara aktual oleh Admin.

### D. Perbaikan Infrastruktur Penyimpanan Data (PUT CMS)
- **Logika di BE:**
  1. **Tabrakan Primary Key (Update ID):** Saat Admin mengedit (PUT) data Promo, Destinasi, atau Armada, BE harus menghapus atribut `id` dari body request sebelum melakukan `knex.update()`. Knex akan menghasilkan *error* jika BE mencoba menimpa kolom *Primary Key* secara paksa.
  2. **Parsing Multipart (Gambar):** BE wajib memasangkan *middleware* `multer` pada endpoint `PUT` (tidak hanya pada `POST`) agar data gambar yang dikirim FE bisa diproses.
  3. **Data Translation:** FE mengirimkan kolom diskon dengan nama `discount`, BE bertugas menerjemahkannya untuk disimpan ke kolom `discount_percentage` di *database*.
  4. **Nested JSON Adress:** BE bertugas memastikan format alamat bersarang (Kecamatan, Desa, detail) yang dikirim FE disimpan dengan aman (misalnya sebagai *JSON String*) dan dikembalikan ke panel Admin secara utuh tanpa rusak.
