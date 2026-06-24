# Daftar Tugas Selanjutnya untuk Frontend (FE_Next_Jobs)

Dokumen ini berisi daftar fitur, halaman, dan integrasi di sisi Frontend yang **masih belum dikerjakan** atau **belum terintegrasi penuh**, dan harus menjadi fokus pengerjaan pada fase berikutnya (setelah Backend selesai menyesuaikan diri dengan FE saat ini).

---

## 1. Portal Supir (Driver Area) - Prioritas Utama
Modul supir saat ini baru sebatas antarmuka statis atau belum terhubung sepenuhnya dengan *state* aktual di Backend.

- [ ] **Alur UI/UX Utama Supir:** Membuat rancangan antarmuka untuk portal supir saat bertugas di jalan (Mobile-first design).
- [ ] **Daftar Tugas (Schedules):** Mengintegrasikan halaman agar supir bisa melihat jadwal keberangkatan yang ditugaskan kepada mereka (`GET /api/driver/schedules`).
- [ ] **Tombol Status Perjalanan:** Menambahkan aksi interaktif agar supir bisa melaporkan status secara real-time (Boarding -> In Transit -> Arrived) via `PUT /api/driver/schedules/:id/status`.
- [ ] **Klaim Pengeluaran (Bensin/Tol):** Membangun form untuk unggah bukti bon pengeluaran (`POST /api/driver/expenses` menggunakan `FormData`).
- [ ] **Log Perawatan Kendaraan:** Membuat formulir pencatatan servis/bengkel berkala (`POST /api/driver/maintenance-logs`).

## 2. Pengecekan Ketersediaan Kursi Secara Riil
- [ ] **Integrasi API Seats:** Menghapus blok *catch* "Fallback Murni" di `RouteBookingForm.astro` setelah BE menyediakan endpoint `GET /api/travel/seats`, agar kursi benar-benar terkunci secara visual jika sudah dibooking orang lain.

## 3. Pelacakan Paket (Tracking)
- [ ] **Fitur Lacak Resi:** Membangun antarmuka untuk melacak status pengiriman paket (Waybill Tracking) bagi *Customer* / *Guest*.
- [ ] **Integrasi Resi:** Menyambungkan UI dengan endpoint `GET /api/packages/track/:waybill_number`.

## 4. Keuangan Admin (Cashflow)
- [ ] **Pembukuan (Ledger):** Mengembangkan tampilan UI *Buku Besar* dan grafik *Laba-Rugi* yang mengambil data riil dari `GET /api/admin/cashflow/summary`.
- [ ] **Approval Pengeluaran Supir:** Menambahkan fungsionalitas bagi Super Admin untuk menyetujui klaim bensin/tol dari supir.

## 5. Sinkronisasi UI Global
- [ ] **Global Error & Success Handling:** Memastikan semua pemesanan dan pengiriman form (baik di Publik maupun Admin) terhubung dengan komponen Modal Feedback/Alert sistem, menghilangkan penggunaan `alert()` bawaan browser.
- [ ] **Pembersihan Kode Klien (Refactoring):** Membersihkan kode-kode JS simulasi/dummy (*dead code*) yang tersisa dari iterasi awal pengembangan.
