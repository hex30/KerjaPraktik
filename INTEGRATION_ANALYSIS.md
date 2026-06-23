# Hasil Analisis Mendalam Integrasi Frontend - Backend

Berdasarkan pengecekan kode sumber pada direktori `backend-travel/src` (Backend) dan disandingkan dengan daftar *To-Do* dari tim Frontend di file `report.md`, berikut adalah analisis komprehensif mengenai **Status Kesiapan Backend**:

> [!WARNING]
> Hampir seluruh *request* atau *To-Do* dari tim Frontend yang dicantumkan dalam `report.md` **belum diimplementasikan** oleh tim Backend. Integrasi saat ini masih terhambat oleh validasi skema lama dan tidak tersedianya beberapa *endpoint* baru.

Berikut rincian hasil temuan pada sisi Backend:

## 1. Modul Layanan Rute & Pemesanan (Travel Reguler)
- **`POST /api/travel/schedules/availability` (Cek Sisa Kursi Massal)**
  - **Status BE:** ❌ **Belum Ada**. Tidak ada *route* maupun *controller* yang melayani pengecekan ketersediaan kursi secara massal berdasarkan `dates` array dan `route_id`.
- **`GET /api/travel/seats?route_id=...&date=...` (Denah Kursi Riil)**
  - **Status BE:** ❌ **Belum Ada**. Endpoint riwayat kursi ini tidak ditemukan pada `travel.routes.js`. Backend hanya memiliki `GET /api/travel/schedules` yang bersifat umum.
- **`POST /api/travel/bookings` (Pembaruan Skema Booking & Payment Flow)**
  - **Status BE:** ❌ **Belum Disesuaikan**. Pada file `middlewares/validation.middleware.js` skema `travelBookingSchema`, `schedule_id` masih **diwajibkan** berformat UUID, dan `payment_method` masih dibatasi ketat dengan validasi `['cash', 'cashless']`. Backend tidak siap menerima `route_id` dan `departure_date` alih-alih `schedule_id`.

## 2. Modul Sewa Armada (Charter)
- **`GET /api/content/fleets` (Katalog Armada Publik)**
  - **Status BE:** ❌ **Belum Ada**. Pada file `routes/content.routes.js`, hanya terdapat *endpoint* `/banners`, `/destinations`, dan `/promotions`. Rute publik untuk *fleets* belum dibuat.
- **`POST /api/charter/request` (Penyesuaian Skema Request Charter)**
  - **Status BE:** ❌ **Belum Disesuaikan**. Pada `charterRequestSchema` di `validation.middleware.js`, `car_type` masih divalidasi sangat ketat: `z.enum(['Luxio', 'Elf'])`. Ini akan menolak armada tipe lain atau jika FE menggunakan `fleet_id`.

## 3. Modul Titip Paket
- **`POST /api/packages/shipments` (Error 500 & Tambahan Kolom `departure_date`)**
  - **Status BE:** ❌ **Belum Disesuaikan**. Skema validasi `packageShipmentSchema` belum mengizinkan/menerima atribut `departure_date`. Akibatnya *request* dari Frontend dengan field baru ini akan diabaikan atau gagal. Alamat *pickup* (`pickup_address`) sebenarnya sudah tervalidasi minimal 10 karakter di BE, sehingga *Error 500* kemungkinan besar murni *crash* karena ada kolom wajib di *database* yang tidak cocok atau gagal disisipkan oleh *Controller*.

## 4. Modul Konten Promosi Global
- **`GET /api/content/promotions` (Promo Tunggal & Max Discount)**
  - **Status BE:** ⚠️ **Sebagian Selesai**. *Endpoint* publik sudah ada. Namun, JSDoc dan skema (baik `adminValidationSchemas.promotion` maupun rute publik) masih menerima/menyimpan `promo_type: ['home', 'service', 'all']`. Skema belum diupdate untuk memiliki atribut `max_discount` sesuai permintaan form Admin Frontend.

## 5. Dashboard Admin
- **`GET /api/admin/dashboard/metrics` (Revisi Key Respon)**
  - **Status BE:** ❌ **Belum Sesuai Ekspektasi FE**. Saat ini BE merespon dengan *keys* berupa `registered_users`, `active_drivers`, dan `orders_today`. Frontend meminta tepat menggunakan nama *keys*: `total_users`, `total_drivers`, dan `total_bookings_today`.
- **`GET /api/admin/dashboard/departure-requests` & `PUT .../:id/approve` (Izin Keberangkatan)**
  - **Status BE:** ❌ **Belum Ada**. Pada `dashboard.routes.js`, tidak ada *endpoint* tersebut.

## 6. Manajemen Pemesanan Admin (JSON Alamat Tersarang)
- **Modul `travel-bookings`, `charter/history`, `package-shipments`**
  - **Status BE:** ❌ **Belum Sesuai**. Skema validasi admin untuk pengiriman paket `adminValidationSchemas.packageShipment` dan pemesanan reguler tidak menunjukkan adanya peralihan ke skema *Nested JSON* untuk `address_detail` (kecamatan, desa, dsb). Skema BE masih menggunakan representasi teks tunggal biasa seperti `pickup_address` / `dropoff_address`. Antarmuka admin pasti akan mengalami *Fallback* "DATA BE BELUM SESUAI".

## 7. Modul Kelola Konten CMS (Multipart)
- **`POST/PUT /api/admin/cms/promotions`, `destinations`, `fleets`**
  - **Status BE:** ❌ **Perlu Diperiksa Ulang (Risiko Tinggi)**. Backend saat ini menggunakan rute terpusat (`/api/admin/master/...`) menggunakan `crudRoute` yang mana tidak ada indikasi *middleware* seperti `multer` disuntikkan secara dinamis untuk menerima `FormData` (Multipart) dalam proses unggah gambar.

## Kesimpulan
Tim Backend **belum menyelesaikan** penyesuaian yang diminta. Integrasi saat ini akan menyebabkan banyak kegagalan di sisi Frontend, terutama pada form pemesanan (Travel, Paket, Charter) akibat restriksi validasi `Zod` di Backend (`validation.middleware.js`) yang masih belum diperbarui. 

**Tindakan yang Disarankan untuk Backend:**
1. Hapus kewajiban `schedule_id` dan `payment_method` pada *booking* reguler, dan ganti dengan penerimaan `route_id` + `departure_date`.
2. Cabut enum ketat armada di Charter.
3. Tambahkan endpoint `POST /api/travel/schedules/availability`, `GET /api/travel/seats`, `GET /api/content/fleets`, dan `departure-requests` di Dashboard.
4. Sesuaikan `keys` JSON di Dashboard Metrics.

## 8. Modul Kelola Konten (Bug Form Edit)
- **`PUT /api/admin/cms/promotions/:id`, `destinations/:id`, `fleets/:id`**
  - **Status BE:** ❌ **Menyebabkan Error Silent (Gagal Simpan)**.
  - **Penyebab 1 (Tabrakan Primary Key):** Saat Frontend mengirimkan _form update_ yang berisi payload `id` dalam `req.body`, instruksi `updateRecord` di `masterData.model.js` akan mencoba mengeksekusi `UPDATE ... SET id = ...` pada PostgreSQL. Hal ini terlarang dan akan membuat proses *update* gagal total. **Saran untuk BE:** Hapus properti `id` dari `req.body` sebelum memasukkannya ke fungsi `.update(data)` di Knex.
  - **Penyebab 2 (Ketidaksesuaian Nama Field Diskon):** Form Frontend mengirimkan payload diskon dengan atribut `discount`, namun kolom tabel di Database Backend bernama `discount_percentage`. Proses _update_ dari Frontend akan gagal karena PostgreSQL memunculkan pesan error "column 'discount' of relation 'promotions' does not exist". **Saran untuk BE:** Sesuaikan nama kolom `discount_percentage` menjadi `discount` di Database ATAU pastikan `masterData.model.js` menerjemahkan `discount` menjadi `discount_percentage` saat menerima _request_.
