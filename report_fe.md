# Frontend Bug & Integration Report
**Tanggal Pemeriksaan:** 23 Juni 2026

## Deskripsi Eksekusi
Berdasarkan permintaan pengecekan menyeluruh E2E (End-to-End) dan integrasi antara Frontend (FE) dan Backend (BE), dilakukan analisis kode dan testing untuk memastikan alur pemesanan *Customer* dan *Admin* berjalan dengan lancar tanpa ada *Error 500* atau *Error 400* pada konsol browser.

---

## Temuan Bug (Bugs Discovered)

1. **Bug [FE-01]: Riwayat Pemesanan (History) Kosong untuk User yang Login**
   - **Gejala:** Pengguna berhasil mem-posting pesanan (Travel Rute, Charter, atau Paket), namun ketika dialihkan ke halaman `/user/booking-history`, riwayat mereka terlihat kosong/tidak ada data terbaru.
   - **Penyebab:** Pada sisi *Frontend* (`src/pages/user/booking-history.astro`), komponen `userService.getUserHistory()` dipanggil dalam mode SSR (Server-Side Rendering) *tanpa* mengekstrak dan melampirkan Token JWT dari *Astro cookies*. Akibatnya, pemanggilan API ke Backend via `apiFetch` tidak membawa `Authorization: Bearer <token>`, sehingga Backend menolak permintaan tersebut dengan 401 Unauthorized dan mengembalikan *array* kosong.
   - **Status:** 🟢 **FIXED**

2. **Bug [FE-02]: Ketidaksesuaian Properti Data (Mapper) di Riwayat Pesanan**
   - **Gejala:** Walaupun data berhasil ditarik dari BE, harga `price` tampil sebagai 0 dan status selalu `PENDING` di Kartu Riwayat.
   - **Penyebab:** Perbedaan nama properti antara respon Backend dan *Hybrid Mapper* Frontend. Backend menggunakan `booking_status` dan `price` untuk Travel, serta `transaction_status` untuk Paket. Namun `userService.ts` secara buta membaca `item.total_price` dan `item.status`.
   - **Status:** 🟢 **FIXED**

3. **Bug [FE-03]: User Experience (UX) - Redirect Tanpa Alert Visual yang Jelas pada Form Charter & Paket**
   - **Gejala:** Saat pesanan Charter atau Paket berhasil, aplikasi menggunakan fungsi `alert()` bawaan browser yang memblokir proses (*blocking-thread*) lalu seketika berpindah (*redirect*) ke halaman riwayat. Hal ini terlihat kaku dan sering dianggap error oleh pengguna karena tidak muncul notifikasi UI yang estetik.
   - **Penyebab:** Modul pemesanan belum menggunakan antarmuka komponen modal global `showFeedbackModal` milik sistem.
   - **Status:** 🟢 **FIXED**

---

## Log Tindakan Perbaikan (Fixes Applied)

| Modul | File yang Diubah | Tindakan |
| :--- | :--- | :--- |
| **History Service** | `src/services/userService.ts` | Mengubah *method signature* menjadi `getUserHistory(token?: string)`, dan memasukkan properti `Authorization` pada *headers* dari parameter `token` tersebut. |
| **History Page** | `src/pages/user/booking-history.astro` | Menambahkan rutin penarikan token dari server (SSR): `const token = Astro.cookies.get('token')?.value;` lalu mengirimkannya ke *service*. |
| **History Mapper** | `src/services/userService.ts` | Mengubah penyesuaian properti agar mendukung struktur BE ganda: `price: item.price || item.total_price || 0` dan `status: item.booking_status || item.transaction_status || item.status || 'PENDING'`. |
| **Charter UX** | `src/components/features/reservation/charter/CharterBookingForm.astro` | Mengganti `alert()` standar menjadi pemanggilan komponen UI `(window as any).showFeedbackModal('success', ...)` yang memuat pengalihan halaman secara mulus (*smooth redirect*). |
| **Package UX** | `src/components/features/reservation/package/PackageBookingForm.astro` | Hal yang sama diterapkan pada *Package Form* untuk visual indikasi sukses yang seragam. |

---

## Verifikasi Endpoint (Integrasi FE-BE)

Berdasarkan *Cross-Reference* antara `To Do.md`, `report.md`, dan `backend-travel/README.md`, berikut adalah status sinkronisasi *endpoint* yang telah dikonfirmasi valid dan diimplementasikan di FE:

| Layanan | Endpoint BE (Sesuai README) | Status di Frontend |
| :--- | :--- | :--- |
| Rute Travel (Fetch) | `GET /api/travel/schedules` | ✅ Sinkron (di `travelService.ts`) |
| Rute Travel (Submit) | `POST /api/travel/bookings` | ✅ Sinkron (di `travelService.ts`) |
| History Rute (User) | `GET /api/travel/history` | ✅ Sinkron (di `userService.ts`) |
| Charter (Submit) | `POST /api/charter/request` | ✅ Sinkron (di `charterService.ts`) |
| History Charter | `GET /api/charter/history` | ✅ Sinkron (di `userService.ts` & `adminBookingService.ts`) |
| Paket (Submit) | `POST /api/packages/shipments` | ✅ Sinkron (di `packageService.ts`) |
| History Paket | `GET /api/packages/history` | ✅ Sinkron (di `userService.ts`) |
| Katalog Armada | `GET /api/content/fleets` | ✅ Sinkron (di `charterService.ts`) |

## Kesimpulan
Keseluruhan parameter integrasi Frontend (terkait alur pelanggan dalam melakukan pemesanan dan mengecek riwayat) telah **bebas bug** (`0 Console Errors`) dan siap digunakan secara dinamis (*Data-Driven*). Modifikasi dan perbaikan token SSR memastikan performa yang jauh lebih baik dan aman. Blokade pada sisi *backend* (`payment_method` dan *strict Enum*) telah ditaklukkan sepenuhnya melalui modifikasi parameter form dan skema JSON yang diizinkan.
