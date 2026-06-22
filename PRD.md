# 📄 Product Requirements Document (PRD)
**Proyek:** Integrasi API (Frontend - Backend) PT. Rini Trans Putri
**Aktor Pelaksana:** AI Agent (Antigravity AI CLI / Gemini)
**Dokumen Referensi Utama:** `D:\ProjekKp\KerjaPraktik\GEMINI.md` & `D:\ProjekKp\backend-travel\README.md`
**Path Direktori FE:** `D:\ProjekKp\KerjaPraktik`
**Path Direktori BE:** `D:\ProjekKp\backend-travel`

---

## 1. Tujuan Dokumen
Dokumen ini menetapkan standar operasional baku (SOP), alur kerja (workflow), dan batasan arsitektur bagi AI Agent dalam melaksanakan tugas integrasi (penyambungan) antara layanan Backend berbasis RESTful API dengan antarmuka Frontend berbasis Astro Framework. Seluruh proses diwajibkan berjalan secara modular, inkremental (bertahap), tersertifikasi dengan dokumentasi kode, dan dicatat dalam jurnal pelaporan `report.md`.

## 2. Batasan Arsitektur & Aturan Main (Strict Adherence to `GEMINI.md`)
Sebelum AI Agent memulai baris kode apa pun, aturan berikut bersifat **MUTLAK** dan tidak dapat diganggu gugat:
1. **Tech Stack Murni:** Menggunakan `.astro`, Tailwind CSS, dan Vanilla JavaScript (ES6+). **Dilarang keras** menggunakan SPA Framework (React, Vue, dll).
2. **No Business Logic di Frontend:** Semua kalkulasi, harga, diskon, komisi, dan logika data harus diterima secara pasif dari Backend. Frontend hanya bertugas merender (*Data Binding*).
3. **Penggunaan Komponen Reusable:** Wajib menggunakan komponen yang sudah terdaftar di `GEMINI.md` (seperti `InputGroup`, `Badge`, `Button`, `AdminLayout`, dll) sebelum membuat elemen mentah baru.
4. **Path Aliases:** Wajib menggunakan *Astro Path Aliases* (berdasarkan `tsconfig.json`) dan menghindari pengimporan relatif (contoh: hindari `../../components/Button.astro`).
5. **Single Global Promo:** Tidak ada pemisahan tipe promo. Frontend hanya memanggil 1 promo aktif secara global dan memetakan datanya secara dinamis sesuai halaman (Home/Services).
6. **Alur Pembayaran 4 Tahap (Deferred Payment):** User membuat pesanan -> Admin menetapkan harga final -> User membayar (Upload Bukti) -> Admin verifikasi status selesai. Frontend dilarang meminta metode pembayaran saat inisiasi pembuatan pesanan.

## 3. Protokol Eksekusi & Otorisasi AI
AI Agent **dilarang** menyelesaikan seluruh integrasi dalam satu waktu. Protokol eksekusi diatur sebagai berikut:
* **Isolasi Komponen:** Pengerjaan dilakukan secara spesifik per **1 Halaman**, **1 Fitur**, atau **1 Komponen** pada satu waktu (Contoh: *Integrasi Halaman Login* saja).
* **Sistem Checkpoint (Otorisasi Pengguna):** AI Agent **WAJIB berhenti dan meminta izin pengguna (User Consent)** sebelum berpindah ke tahapan berikutnya.
* **Inline Documentation:** Setiap kode JavaScript atau Astro yang menyangkut pemanggilan API wajib diberikan komentar penjelas. Format wajib: `// dokumentasi: [Penjelasan fungsi baris ini]`.
* **Ledger Pelaporan:** Setiap tahapan yang selesai dan tervalidasi wajib dicatat/ditulis ulang (di-append) ke dalam file `report.md` berdasarkan kategori halamannya.

---

## 4. Alur Kerja Integrasi 5 Langkah (The 5-Step Pipeline)

Untuk setiap komponen atau halaman yang dikerjakan, AI Agent harus mematuhi urutan 5 langkah berikut secara presisi:

### Tahap 1: API Contract Understanding (Pemahaman Kontrak API)
* **Aksi AI:** Membaca dokumen `README.md` backend untuk mencari endpoint yang relevan dengan fitur yang sedang dikerjakan.
* **Output:** Menyajikan ringkasan kepada pengguna mengenai Method (GET/POST/PUT/DELETE), Endpoint URI, Headers (perlu Authorization/Bearer token atau tidak), struktur Body Request (JSON/FormData), dan ekspektasi Response.
* **Cek Izin:** *"Apakah kontrak API ini sudah sesuai dengan yang Anda harapkan? Ketik 'Lanjut' untuk mulai membuat fungsi fetch/integrasinya."*

### Tahap 2: API Integration / API Consumption (Pembuatan Layanan Klien)
* **Aksi AI:** Membuat atau memodifikasi file *service* (misal: `src/services/auth.service.js`) menggunakan Vanilla JS `fetch()`.
* **Aturan Kode:**
    * Wajib menggunakan block `try...catch`.
    * Wajib mengambil Base URL dari *environment variable* atau konstanta terpusat.
    * Menerapkan *Inline Documentation*.
* **Contoh Kode AI:**
```javascript
    // dokumentasi: Fungsi untuk mengirim kredensial login ke endpoint /api/auth/login
    export const loginUser = async (email, password) => {
        try {
            // dokumentasi: Melakukan request POST dengan payload JSON
            const response = await fetch(`${API_URL}/api/auth/login`, { ... });
            return await response.json();
        } catch (error) {
            // dokumentasi: Menangkap error jaringan atau server
            console.error("Login failed:", error);
        }
    };
    ```
* **Cek Izin:** *"Fungsi API Service telah disiapkan. Apakah saya diizinkan untuk mengimplementasikannya ke dalam komponen Astro UI terkait?"*

### Tahap 3: API Contract Implementation (Implementasi UI/UX & Data Binding)
* **Aksi AI:** Menyambungkan fungsi *service* (Tahap 2) ke dalam file `.astro` (di dalam tag `<script>`) atau mengikat data (*Data Binding*) ke elemen DOM.
* **Aturan Kode:**
* Terapkan *Role-Based Access Control* (Guest, Customer, Supir, Admin) sesuai `GEMINI.md` (Tahap 4 User Hierarchy).
* Terapkan *State UI* (Loading spinner, Disabled button) saat API sedang dipanggil.
* Gunakan komponen *reusable* Tailwind.
* **Cek Izin:** *"Implementasi DOM dan komponen UI selesai. Apakah kita bisa lanjut ke tahap pengujian lokal?"*

### Tahap 4: Local Integration Testing (Pengujian Integrasi Lokal)
* **Aksi AI:** Merancang skenario pengujian yang harus dilakukan oleh pengguna (atau disimulasikan oleh AI melalui console logs). Ini memastikan apakah *CORS* tidak bermasalah, JWT token berhasil disimpan ke `localStorage`, dan elemen UI berubah sesuai respon JSON.
* **Output:** Panduan *step-by-step* untuk menguji antarmuka di `localhost:4321` yang terhubung ke backend `localhost:5000`.
* **Cek Izin:** *"Silakan lakukan pengujian sesuai langkah di atas. Apakah ada error di console browser atau UI yang tidak responsif? Jika aman, kita lanjut ke tahap final."*

### Tahap 5: Bug Fix & Validation (Perbaikan Kutu & Validasi Akhir)
* **Aksi AI:** Menangani laporan error dari pengguna (misal: token expired, bad request 400, atau layout pecah). Jika tidak ada error, lakukan *code cleanup*.
* **Pelaporan (Wajib):** AI Agent secara mandiri mengkompilasi dokumentasi proses Tahap 1 hingga Tahap 5 untuk fitur ini dan menyimpannya ke dalam file **`report.md`**.
* **Format Penulisan `report.md`:**
```markdown
    ## [Kategori/Halaman] - [Nama Fitur] (Tgl Penyelesaian)
    - **Endpoint:** `POST /api/auth/login`
    - **File Frontend Terubah:** `src/pages/login.astro`, `src/services/auth.js`
    - **Status:** Selesai & Tervalidasi.
    - **Catatan Integrasi:** Token JWT berhasil disimpan di localStorage dan diarahkan berdasarkan Role pengguna.
    ```
* **Cek Izin:** *"Tahapan untuk fitur [Nama Fitur] telah selesai dan didokumentasikan di report.md. Fitur halaman apa selanjutnya yang ingin kita kerjakan?"*

---

## 5. Struktur Pembagian Kategori Halaman (Roadmap Integrasi)
Sesuai instruksi, pengerjaan akan dibagi per halaman. AI Agent akan menjadikan daftar ini sebagai peta jalan integrasinya:

1. **Modul Autentikasi (`/api/auth`)**
    * Halaman Login (`/login`)
    * Halaman Registrasi (`/register`)
2. **Modul Publik & Konten (`/api/content`)**
    * Halaman Beranda / Home (Banner, Promosi Terkini, Destinasi)
3. **Modul Layanan Customer (`/api/travel`, `/api/charter`, `/api/packages`)**
    * Halaman Pencarian Jadwal & Booking Travel
    * Halaman Pengajuan Sewa Pariwisata
    * Halaman Pengiriman Paket Reguler
    * Halaman Riwayat Pesanan Customer (Customer Dashboard)
4. **Modul Driver (`/api/driver`)**
    * Dashboard Supir (Melihat jadwal & Manifest)
    * Halaman Pengajuan Biaya Operasional (Upload Bukti)
    * Halaman Laporan Kendaraan (Maintenance Logs)
5. **Modul Admin Master & CMS (`/api/admin/master`, `/api/admin/cms`)**
    * Manajemen Armada, Rute, & Jadwal
    * Manajemen Konten Banner & Promosi
    * Verifikasi Pembayaran & Pemesanan Tiket
6. **Modul Cashflow & Dashboard Admin (`/api/admin/cashflow`, `/api/admin/dashboard`)**
    * Dashboard Metrik Laba Rugi (Buku Besar/Ledger)
    * Verifikasi Pengajuan Operasional Supir

---
**Instruksi Akhir untuk AI Agent:**
Baca dan pahami PRD ini. Pastikan untuk selalu memeriksa ketersediaan komponen di `GEMINI.md` sebelum menyusun HTML mentah, dan tunggu aba-aba/izin dari saya untuk memulai integrasi halaman pertama (Tahap 1). Mengerti?