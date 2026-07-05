# Backend Tasks & Optimizations (To-Do)

Dokumen ini berisi daftar pekerjaan, rekomendasi optimasi performa, dan isu-isu yang perlu diselesaikan oleh Tim Backend.

---

## 1. [URGENT] Optimasi Endpoint Dashboard (`/metrics`)
**Lokasi:** `backend-travel/src/controllers/dashboard.controller.js`

**Deskripsi Masalah:**
Saat ini, endpoint `/metrics` memanggil fungsi `getActiveDutiesList()` yang melakukan sekitar 6 *query batch* (termasuk JOIN yang cukup berat) secara bersamaan hanya untuk mendapatkan angka statistik dan 2 item teratas penugasan aktif.
Masalah terjadi karena Frontend juga memanggil endpoint terpisah yaitu `/active-duties` di saat yang bersamaan, yang mana endpoint tersebut memanggil ulang fungsi `getActiveDutiesList()` yang sama persis. Akibatnya, database bekerja dua kali lipat untuk mengeksekusi query berat yang sama dalam satu waktu.

**Rekomendasi Solusi:**
- Buat query khusus yang ringan (hanya menggunakan `COUNT`) untuk endpoint `/metrics`. Endpoint ini tidak perlu mengirim data *list* penugasan secara detail.
- Biarkan *list* penugasan (termasuk 2 data teratas) ditangani murni oleh endpoint `/active-duties`.

## 2. [PERFORMANCE] Pagination Server-Side untuk Keuangan (`/finance`)
**Lokasi:** Backend endpoint untuk riwayat/data transaksi keuangan.

**Deskripsi Masalah:**
Saat ini, Frontend meminta data transaksi dengan parameter `?limit=200` sekaligus untuk kemudian di-filter di sisi *client* (browser). Hal ini sangat tidak optimal dan akan membebani server serta menghabiskan kuota *bandwith* ketika data transaksi sudah mencapai ribuan.

**Rekomendasi Solusi:**
- Implementasikan *Server-Side Pagination* (limit & offset) serta fitur filtering langsung dari query database. Frontend akan mengirim parameter pencarian/filter dan hanya menerima data sesuai rentang halaman yang diminta (misal: 10-20 data per request).

---
*Catatan: Dokumen ini dibuat berdasarkan hasil audit performa Frontend dan interaksinya dengan API Backend.*
