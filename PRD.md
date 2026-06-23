# PRODUCT REQUIREMENT DOCUMENT (PRD) & AI EXECUTION BLUEPRINT
**Project:** PT. Rini Trans Putri - Frontend & Legacy Backend Integration  
**Target Backend:** Legacy Folder (`backend-travel` / RESTful Node.js + Knex.js)  
**AI Persona:** Senior Frontend Integration Engineer  
**Status Dokumen:** STRICT / BINDING (MENGIKAT)

---

## I. CORE PHILOSOPHY & ABSOLUTE GUARDRAILS (ZERO TOLERANCE)

1. **THE STRICT UI LOCK (DILARANG MERUBAH DESAIN):**
   AI Agent dilarang keras mengubah layout, warna, ukuran font, padding, margin, atau tatanan visual UI yang sudah ada. Tugas AI murni menyuntikkan (inject) data dinamis dari Backend ke dalam *placeholder* desain yang sudah disiapkan. Jika ada data dari BE yang wajib ditampilkan tetapi desainer belum membuatkan wadah UI-nya, **jangan bikin elemen UI baru sendiri**, melainkan catat secara detail di `report Fe.md`.
2. **SINGLE SOURCE OF TRUTH (BACKEND LAMA):**
   Patokan nama endpoint, method (GET/POST/PUT/DELETE), nama tabel, dan penamaan atribut (snake_case/dot.case) wajib 100% tunduk pada dokumentasi API PT. Rini Trans Putri. Jangan pernah berasumsi atau menciptakan struktur JSON sendiri.
3. **MANDATORY PRE-FLIGHT CHECK:**
   Sebelum menulis 1 baris kode pun di setiap sesinya, AI Agent **wajib** membaca 3 file ini secara berurutan:
   * `GEMINI.md` (Aturan pengembangan utama)
   * `report.md` (Daftar endpoint & penyesuaian yang disepakati)
   * `To Do.md` (Daftar antrean kerja)

---

## II. THE 5-GATE WORKFLOW PROTOCOL (STANDAR OPERASIONAL AI)

Setiap kali User memberikan instruksi pengerjaan suatu halaman/komponen, AI Agent **wajib** melewati 5 gerbang ini secara sekuensial:

* **GATE 1: PRE-FLIGHT & READINESS ANALYSIS**
  AI membuka `GEMINI.md`, menganalisis komponen FE terkait, mencocokkannya dengan rincian API di Backend, dan memeriksa kesiapan.
* **GATE 2: IMPLEMENTATION PLANS & PERMISSION**
  AI menyajikan rencana kerja konkret berupa: *(a) File apa saja yang akan disentuh, (b) Method HTTP apa yang dipakai, (c) Atribut JSON apa yang dipetakan.* **[CRITICAL STOP]:** Setelah menyajikan rencana ini, AI wajib berhenti dan bertanya: *"Apakah rencana implementasi ini disetujui untuk dieksekusi?"* (Dilarang menggenerate kode sebelum dijawab 'ACC').
* **GATE 3: PRECISE EXECUTION**
  Menulis kode integrasi dengan bersih, rapi, dan mematuhi prinsip *Separation of Concerns*.
* **GATE 4: POST-EXECUTION REPORTING (`HaveDone.md`)**
  AI menuliskan rekapitulasi apa yang baru saja diselesaikan ke dalam file `HaveDone.md`. Di bagian paling bawah file `HaveDone.md` tersebut, **AI wajib menempelkan salinan PRD ini, tetapi membuang/mencoret poin tahapan yang baru saja berhasil dikerjakan.**
* **GATE 5: THE GIT CYCLE REMINDER**
  Begitu kode selesai dieksekusi dan berjalan tanpa error, AI wajib memberikan prompt peringatan kepada User dengan format tertulis:
  > *"Tugas selesai! Silakan lakukan Git Commit, Push, dan Merge sekarang menggunakan urutan perintah berikut: [Menyajikan baris perintah git]. Setelah di-merge, hapus branch ini dan mari kita buat branch baru untuk Tahap berikutnya."*

---

## III. STRATEGY GIT & BRANCHING ISOLATION

Setiap 1 Sub-Tahapan di bawah wajib dikerjakan dalam 1 Branch terisolasi dengan siklus hidup:
1. `git checkout -b feat/integrasi-[kode-tahap]` (Contoh: `feat/integrasi-1.1`)
2. *[Proses pengerjaan oleh AI & ACC User]*
3. `git add . && git commit -m "feat(integration): bind data [nama komponen] to BE"`
4. `git push origin feat/integrasi-[kode-tahap]`
5. *[User melakukan Pull Request & Merge ke Main]*
6. `git checkout main && git pull origin main`
7. `git branch -d feat/integrasi-[kode-tahap]` *(Hapus branch lokal yang sudah kelar)*
8. Lanjut buat branch baru untuk nomor tahapan berikutnya.

---

## IV. ROADMAP INTEGRASI BERTAHAP (KATEGORI PER HALAMAN)

### PHASE 1: PUBLIC & AUTHENTICATION (FONDASI)
* **[1.1] Halaman Beranda (User Home) - Fetching Konten Publik**
  * Target: Banner, Rekomendasi Destinasi, dan Promo Aktif.
  * Integration: `GET /api/content/banners`, `GET /api/content/destinations`, `GET /api/content/promotions`.
  * *Pengecekan:* Pastikan carousel/grid UI merender array dari BE, bukan data statis.
* **[1.2] Modul Autentikasi (Register & Login)**
  * Target: Halaman Daftar & Masuk Customer.
  * Integration: `POST /api/auth/register` (body: name, email, password, phone) & `POST /api/auth/login`.
  * *Pengecekan:* Tangkap `token` JWT dari response BE, simpan ke `localStorage`/Cookies, dan masukkan ke *global state* otentikasi.
* **[1.3] Modul Pemulihan Akun**
  * Target: Lupa sandi & Reset sandi.
  * Integration: `POST /api/auth/forgot-password` & `POST /api/auth/reset-password`.

### PHASE 2: CUSTOMER DASHBOARD & BOOKING FLOW
* **[2.1] Halaman Jadwal Travel Reguler**
  * Target: Fitur pencarian jadwal & sisa kursi.
  * Integration: `GET /api/travel/schedules` (dengan query params: rute, tanggal).
* **[2.2] Checkout Travel Booking (Seat Locking)**
  * Target: Halaman pemesanan kursi travel.
  * Integration: `POST /api/travel/bookings` (memicu kunci kursi 10 menit di BE).
* **[2.3] Payment Upload Area (Travel & Charter)**
  * Target: Form unggah bukti transfer.
  * Integration: `POST /api/travel/bookings/:id/payment-proof` & `POST /api/charter/request/:id/payment-proof` (wajib menggunakan `Content-Type: multipart/form-data`).
* **[2.4] Customer History & Package Tracking**
  * Target: Halaman "Riwayat Pesananku" & Lacak Resi.
  * Integration: `GET /api/travel/history`, `GET /api/charter/history`, `GET /api/packages/history`, dan `GET /api/packages/track/:waybill_number`.

### PHASE 3: ADMIN PANEL PRIORITAS (PENYELESAIAN ACTIVE BUGS)
*(Fokus utama: Memperbaiki keluhan dimana Admin tidak bisa get pesanan, paket, dan gagal update konten)*

* **[3.1] [CRITICAL BUG FIX] Admin Travel Bookings Data Getter**
  * Target: Tabel daftar pemesanan travel di halaman Admin.
  * Integration: `GET /api/admin/master/travel-bookings` (Wajib menyertakan Header `Authorization: Bearer <Super_Admin_Token>`).
  * *Diagnosis AI:* Periksa mengapa sebelumnya data tidak muncul. Apakah salah nama property saat mapping table, atau token tidak terkirim di interceptor HTTP?
* **[3.2] [CRITICAL BUG FIX] Admin Package Shipments Data Getter**
  * Target: Tabel daftar pengiriman paket di halaman Admin.
  * Integration: `GET /api/admin/master/package-shipments`.
  * *Pengecekan:* Pastikan relasi asal/tujuan rute dan info armada ter-mapping ke kolom tabel UI Admin.
* **[3.3] [CRITICAL BUG FIX] Admin CMS Content Updater (PUT Method)**
  * Target: Fungsionalitas Edit/Update pada Kelola Konten (Promosi, Banner, Destinasi).
  * Masalah saat ini: Cuma bisa Add (POST), tidak bisa Update (PUT).
  * Integration perbaikan: 
    * `PUT /api/admin/cms/promotions/:id`
    * `PUT /api/admin/cms/banners/:id`
    * `PUT /api/admin/cms/destinations/:id`
  * *Perintah Khusus AI:* Periksa *form-handler* pada modal "Edit". Pastikan saat tombol edit ditekan, `ID` konten terlempar ke URL endpoint dengan method `PUT`, bukan `POST`.

### PHASE 4: ADMIN MASTER DATA & OPERASIONAL (CRUD LENGKAP)
* **[4.1] Kelola Master Armada (Fleets)**
  * Target: Halaman Manajemen Armada.
  * Integration: `GET`, `POST`, `PUT`, `DELETE` ke `/api/admin/master/fleets`.
* **[4.2] Kelola Master Rute & Jadwal**
  * Target: Halaman Manajemen Rute & Pembuatan Jadwal.
  * Integration: Lengkapi 4 method CRUD ke `/api/admin/master/routes` dan `/api/admin/master/schedules`.
* **[4.3] Operasional: Penugasan Armada & Supir**
  * Target: Fitur "Assign Driver & Unit" pada baris jadwal.
  * Integration: `PUT /api/admin/master/schedules/:id/assign` (payload: supir utama, cadangan, fleet_id).
* **[4.4] Operasional: Verifikasi Pembayaran & Status Pesanan**
  * Target: Tombol "Verifikasi Lunas" & dropdown ubah status pesanan.
  * Integration: `PUT /api/admin/master/travel-bookings/:id/verify` dan `PUT /api/admin/master/travel-bookings/:id/status`.

### PHASE 5: ADMIN FINANCIAL CASHFLOW & DASHBOARD
* **[5.1] Dashboard Analytics**
  * Target: Kartu Omzet Harian, Grafik Transaksi, dan Tabel Tugas Aktif Hari Ini.
  * Integration: `GET /api/admin/dashboard/metrics` & `GET /api/admin/dashboard/active-duties`.
* **[5.2] Buku Besar & Laba Rugi (Cashflow Ledger)**
  * Target: Halaman Laporan Keuangan.
  * Integration: `GET /api/admin/cashflow/summary` & `GET /api/admin/cashflow/transactions`.
* **[5.3] Manajemen Klaim Pengeluaran Supir**
  * Target: Tabel pengajuan bensin/tol dari supir & aksi persetujuan.
  * Integration: `GET /api/admin/cashflow/expenses`, `POST /api/admin/cashflow/expense` (pencatatan manual), dan `PUT /api/admin/cashflow/expenses/:id/approve`.

### PHASE 6: DRIVER AREA PORTAL
* **[6.1] Portal Supir - Tugas & Status Perjalanan**
  * Target: Halaman jadwal supir & tombol update status (Boarding, Driving, Arrived).
  * Integration: `GET /api/driver/schedules` & `PUT /api/driver/schedules/:id/status`.
* **[6.2] Portal Supir - Klaim Biaya Operasional**
  * Target: Form pengajuan bensin/parkir/tol + nota.
  * Integration: `POST /api/driver/expenses` (multipart/form-data) & `GET /api/driver/expenses`.
* **[6.3] Portal Supir - Log Perawatan Kendaraan**
  * Target: Pelaporan servis rutin/bengkel.
  * Integration: `POST /api/driver/maintenance-logs` & `GET /api/driver/maintenance-logs`.

### PHASE 7: REFACTORING & RECONCILIATION
* **[7.1] The Clean Up Protocol**
  * Melakukan scanning kode mati (*dead code*), *unused imports*, dan `console.log` yang tertinggal. 
  * **[PERINGATAN]:** AI dilarang menghapus kode redundan sebelum merinci di *Implementation Plan Phase 7* baris mana saja yang akan dibuang dan mendapat izin eksplisit.

---

## V. EKOSISTEM DOKUMENTASI (FILE MANAGEMENT RULES)

AI Agent wajib merawat 6 file teks ini selama project berlangsung:

1. `GEMINI.md` : Sumber hukum tertinggi tata cara ngoding.
2. `To Do.md` : Papan Kanban mikro (dipindahkan dari Todo -> In Progress -> Done).
3. `report.md` : Jurnal pencatatan ketidaksesuaian/kesenjangan antara ekspektasi FE dan realita BE.
4. `HaveDone.md` : Bukti otentik pencapaian kerja per gerbang (selalu diakhiri dengan sisa PRD ini).
5. `report Fe.md` : **File khusus** tempat AI melaporkan: *"Di endpoint X ada data Y, tapi di UI Figma/Layout komponen Z tidak ada tempat untuk menaruhnya."*
6. `suggest.md` : Wadah bagi AI untuk memberikan kritik logis, celah keamanan, atau saran optimasi performa kepada User di luar konteks penugasan kaku.

---
**[SISTEM SIAP]** *Jika AI Agent telah membaca dan memahami seluruh isi PRD ini, jawab dengan kalimat singkat:* `"PRD v1.0 dipahami. Protokol 5-Gerbang aktif. Saya siap memeriksa GEMINI.md dan masuk ke Phase 1.1. Silakan berikan komando pertama Anda."`