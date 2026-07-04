# Laporan Audit FE-BE Integration

Tanggal: 5 Juli 2026

---

## STATUS PERBAIKAN

  [DONE] dummy_user_rini_trans di authGuard.ts --> sudah dihapus
  [SKIP] Field mismatch finance summary --> BY DESIGN, BE akan menyusul
  [DONE] Ganti fetch() native ke apiFetch() --> 5 lokasi sudah direplace
  [TODO] Hapus file test-api.ts
  [TODO] Replace alert() dan confirm() dengan UI Card
  [TODO] Rename variabel mock* di finance.astro
  [TODO] Rename dummy-promo.jpg
  [TODO] Hardcoded hari operasi rute
  [TODO] Server-side pagination finance

---

## 1. INTEGRASI FE-BE

### 1a. Finance Summary (BY DESIGN - bukan bug)

FE sudah siap menerima field: today_expense, this_year_income, this_year_expense
BE belum mengirimnya. Tim BE akan menambahkan nanti.

### 1b. Variabel Menyesatkan di finance.astro (baris 41-44)

Variabel masih pakai prefix "mock" padahal data sudah real dari BE:
  - mockExpenseLastMonth  --> sebaiknya rename jadi: expenseLastMonth
  - mockExpenseToday      --> sebaiknya rename jadi: expenseToday
  - mockIncomeYear        --> sebaiknya rename jadi: incomeYear
  - mockExpenseYearThis   --> sebaiknya rename jadi: expenseYearThis

### 1c. Dashboard Metrics - SUDAH MATCH, tidak ada masalah

  - total_bookings_today --> OK
  - total_users          --> OK
  - total_drivers        --> OK

---

## 2. DATA DUMMY YANG MASIH TERSISA

### 2a. [DONE] dummy_user_rini_trans di authGuard.ts

Sudah dihapus. Sekarang hanya membaca dari "user_data".

### 2b. [TODO] Fallback Image dummy-promo.jpg (4 lokasi)

File-file yang masih referensi "/images/dummy-promo.jpg":

  1. src/pages/index.astro                               (baris 89)
  2. src/pages/index.astro                               (baris 107)
  3. src/pages/index.astro                               (baris 125)
  4. src/components/features/promotion/PromotionSection.astro (baris 33)

Solusi: Rename file jadi "default-promo.jpg" dan update 4 referensi.

### 2c. [TODO] Hari Operasi Hardcoded di RouteBookingForm.astro (baris 60-71)

Komentar di kode: "Logika hari hardcode sementara"
Hari operasi di-hardcode berdasarkan string origin:
  - origin mengandung "jakarta"     --> "Selasa, Kamis, Sabtu dan Minggu"
  - origin mengandung "panawangan"  --> "Senin, Rabu dan Jum'at"

Idealnya: data hari dari BE (kolom operating_days di tabel routes).

### 2d. [TODO] File test-api.ts - HARUS DIHAPUS

File: src/pages/api/test-api.ts
Berisi endpoint test publik (GET /api/test-api) dengan token dummy "123".
Token memang di-reject BE, tapi endpoint tetap terekspos di production.

---

## 3. ISU PERFORMA

### 3a. Finance: Fetch 200 transaksi sekaligus

File: src/pages/admin/finance.astro (baris 26)
FE meminta ?limit=200 lalu filter client-side.
Sebaiknya: server-side pagination + filter.

### 3b. Dashboard: Double query active duties

File: backend-travel/src/controllers/dashboard.controller.js (baris 6-10)
Endpoint /metrics memanggil getActiveDutiesList() (6 query batch)
hanya untuk ambil 2 item teratas. Query sama dipanggil lagi di /active-duties.

### 3c. [DONE] Tidak menggunakan apiFetch() wrapper (5 lokasi)

Sudah diperbaiki. `fetch()` native di `booking-history.astro` dan `expenses.astro` sudah diganti dengan `apiFetch()`.

---

## 4. DAFTAR ALERT() DAN CONFIRM() YANG BELUM PAKAI UI CARD

Halaman yang SUDAH BENAR pakai showFeedbackModal():
  - login.astro
  - RouteBookingForm.astro
  - PackageBookingForm.astro
  - CharterBookingForm.astro
  - MainLayout.astro (validasi)

Halaman yang SUDAH BENAR pakai custom showModal():
  - users.astro
  - PromoManager.astro


### 4a. HALAMAN DRIVER (16 alert + 1 confirm)

driver/index.astro:
  Baris 731  | alert | "Untuk pembayaran Cash, bukti penagihan wajib diunggah..."
  Baris 761  | alert | "Tugas anda telah berakhir terimakasih..."
  Baris 763  | alert | "Status penumpang berhasil diperbarui!"
  Baris 767  | alert | "Gagal memperbarui status: ..."
  Baris 838  | alert | "Untuk pembayaran Cash, bukti penagihan wajib diunggah..."
  Baris 868  | alert | "Tugas anda telah berakhir terimakasih..."
  Baris 870  | alert | "Status paket berhasil diperbarui!"
  Baris 874  | alert | "Gagal memperbarui status paket: ..."
  Baris 945  | alert | "Untuk pembayaran Cash, bukti penagihan wajib diunggah..."
  Baris 974  | alert | "Status charter berhasil diperbarui!"
  Baris 977  | alert | "Gagal memperbarui status charter: ..."

driver/report.astro:
  Baris 166  | alert | "Laporan pengeluaran berhasil dikirim!"
  Baris 170  | alert | "Gagal mengirim laporan: ..."
  Baris 214  | alert | "Laporan kerusakan armada berhasil dikirim!"
  Baris 218  | alert | "Gagal mengirim laporan: ..."

DriverLayout.astro:
  Baris 195  | confirm | "Apakah Anda yakin ingin keluar dari halaman Supir?"


### 4b. HALAMAN USER (7 alert + 2 confirm)

booking-history.astro:
  Baris 89   | alert   | "Terima kasih banyak! Silakan bayarkan uang Anda..."
  Baris 94   | alert   | "Gagal: ..."
  Baris 98   | alert   | "Gagal terhubung ke server"
  Baris 153  | confirm | "Batalkan Pesanan?..."
  Baris 182  | alert   | "Dibatalkan! Pesanan Anda berhasil dibatalkan."
  Baris 185  | alert   | "Gagal! ..."
  Baris 200  | confirm | "Hapus Riwayat?..."
  Baris 226  | alert   | "Terhapus! Riwayat pesanan telah dihapus..."
  Baris 229  | alert   | "Gagal! ..."


### 4c. HALAMAN ADMIN (19 alert + 7 confirm)

fleet.astro:
  Baris 248  | alert   | "Data armada berhasil disimpan!"
  Baris 251  | alert   | "Gagal menyimpan armada"
  Baris 269  | confirm | "Apakah Anda yakin ingin menghapus armada..."
  Baris 272  | alert   | "Armada berhasil dihapus!"
  Baris 275  | alert   | "Gagal menghapus armada"

packages.astro:
  Baris 262  | alert   | "Paket berhasil diselesaikan dan masuk ke riwayat!"
  Baris 270  | alert   | "Pembayaran paket berhasil dikonfirmasi!"
  Baris 288  | alert   | "Tagihan berhasil dikirim ke Pelanggan!"
  Baris 295  | alert   | "Gagal: ... (Cek kembali Endpoint BE)"

finance.astro:
  Baris 623  | alert   | "Gagal mengunduh laporan: ..."

expenses.astro:
  Baris 329  | alert   | "Berhasil: ..."
  Baris 336  | alert   | "Error: ..."
  Baris 346  | confirm | "Apakah Anda yakin ingin MENYETUJUI/MENOLAK..."
  Baris 362  | alert   | "Status pengeluaran berhasil diperbarui."
  Baris 369  | alert   | "Error: ..."
  Baris 389  | confirm | "Apakah Anda yakin ingin MENYETUJUI/MENOLAK..."
  Baris 405  | alert   | "Status pengajuan perbaikan berhasil diperbarui."
  Baris 412  | alert   | "Error: ..."

assignments/index.astro:
  Baris 448  | alert   | "Penugasan berhasil disimpan!"
  Baris 456  | alert   | "Terjadi kesalahan sistem."
  Baris 472  | confirm | "Yakin ingin MENOLAK penugasan ini?..."
  Baris 489  | alert   | "Penugasan berhasil ditolak dan dibatalkan."
  Baris 497  | alert   | "Terjadi kesalahan sistem."
  Baris 514  | confirm | "Yakin ingin membatalkan supir?..."
  Baris 529  | alert   | "Supir berhasil dihapus dari penugasan."
  Baris 537  | alert   | "Terjadi kesalahan sistem."
  Baris 555  | confirm | "Yakin ingin menandai armada Sedang Bertugas?..."
  Baris 577  | alert   | "Status berhasil diubah menjadi Sedang Bertugas!"
  Baris 587  | alert   | "Terjadi kesalahan sistem."
  Baris 603  | confirm | "Yakin ingin menghapus tugas dari riwayat?..."
  Baris 617  | alert   | "Terjadi kesalahan sistem."


### 4d. KOMPONEN SHARED (4 alert + 3 confirm)

authGuard.ts:
  Baris 22   | alert   | "Silakan login terlebih dahulu..."
  Baris 34   | alert   | "Anda tidak memiliki akses..."

PaymentPopup.astro:
  Baris 133  | alert   | "Harap pilih file gambar bukti pembayaran!"
  Baris 178  | alert   | "Bukti pembayaran berhasil diunggah!"
  Baris 183  | alert   | "Gagal mengunggah bukti pembayaran: ..."

AdminSidebar.astro:
  Baris 187  | confirm | "Apakah Anda yakin ingin keluar dari halaman Admin?"

BannerManager.astro:
  Baris 159  | confirm | "Hapus banner ini secara permanen?"

DestinationManager.astro:
  Baris 185  | confirm | "Hapus destinasi ini secara permanen?"

PaymentPreviewModal.astro:
  Baris 148  | confirm | (konfirmasi hapus)

---

## TOTAL STATISTIK

  Total alert() yang perlu di-replace  : ~46
  Total confirm() yang perlu di-replace : ~14
  Data dummy masih tersisa              : 3 lokasi (dummy-promo.jpg, hardcode hari, test-api.ts)
  File test yang harus dihapus          : 1 (test-api.ts)
