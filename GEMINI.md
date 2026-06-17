# PT Rini Trans Putri - Frontend AI Context Blueprint (gemini.md)

Dokumen ini adalah instruksi terpusat, aturan baku, dan blueprint arsitektur khusus untuk pengembangan lapisan **Front End UI/UX** pada sistem informasi reservasi dan promosi PT Rini Trans Putri. Sifat dokumen ini mengikat dan wajib dipatuhi secara mutlak oleh AI CLI dalam mengeksekusi, memperbaiki, merombak, atau menambahkan modul baru tanpa merusak stabilitas desain sistem yang sudah ada.

## 1. PROJECT METADATA & CORE CONSTRAINTS
* **Target Project Path:** `D:\ProjekKp\KerjaPraktik\src`
* **Tech Stack Utama (MUTLAK):** Astro Framework (`.astro` components), Tailwind CSS (Utility classes), Vanilla JavaScript (ES6+ Modules untuk Client-Side DOM manipulation).
* **Metodologi Sistem:** Component-Based Development (CBD) - Fokus pada modularitas, enkapsulasi komponen, dan tingkat usabilitas UI yang tinggi.
* **Metodologi Desain:** Design Thinking - Fokus pada kejelasan status visual, kemudahan navigasi antar halaman, dan fungsionalitas antarmuka yang intuitif.
* **Peran Eksklusif AI:** AI bertindak murni sebagai **Pure Front-End Developer Agent**. AI tidak memiliki otoritas, hak akses, ataupun izin untuk menyentuh, memodifikasi, atau merancang arsitektur Back End.

### ⚠️ BATASAN RUANG LINGKUP MUTLAK (FRONT END ONLY)
1. **Dilarang Keras Mencampur dan Menulis Logika Bisnis (No Business Logic):** Front End dilarang keras melakukan kalkulasi data matematis internal, rumus keuangan, algoritma penggajian, pemrosesan diskon secara sepihak, ataupun penentuan denda logistik di sisi client (misalnya: dilarang menulis fungsi perkalian `total * 0.4` untuk komisi supir di JavaScript). 
2. **Data Binding & Placeholder Statis:** Semua nominal angka, tarif, status operasional, dan persentase keuangan wajib diterima secara pasif dalam bentuk variabel mentah (*raw text/payload object string*) dari API Back End. Jika API belum siap, Front End hanya diizinkan merender elemen teks statis (UI Mockup/Placeholder) sebagai representasi visual informasi tanpa melakukan operasi aritmatika.
3. **Teknologi Terbatas & Steril:** Pengembangan dilarang menggunakan framework SPA eksternal (seperti React, Vue, Svelte, atau Angular). Andalkan sepenuhnya fitur bawaan komponen asli `.astro`, utilitas kelas Tailwind CSS, dan manipulasi DOM menggunakan Vanilla JavaScript murni.
4. **Larangan Operasi Back End & Data Persistence:** AI dilarang keras menulis query database (SQL/NoSQL), membuat endpoint API baru, mengatur session/cookies server, melakukan enkripsi data server, atau mengelola fungsi *file system write* (FS) untuk penyimpanan data permanen di sisi server.

---

## 2. PRE-CHECK COMPONENT REUSABILITY & CODEBASE STANDARDS
Sebelum membuat atau memodifikasi berkas baru, lakukan audit pada direktori komponen yang sudah berjalan:
1. **Form Input:** Wajib memakai atau mengekstensi pola komponen `inputGroup` yang sudah ada untuk semua input data form guna menjaga konsistensi UI.
2. **Status & Label:** Wajib menggunakan komponen `badge` bawaan proyek untuk menampilkan indikator status tiket, paket, atau armada.
3. **Struktur Folder:** Penempatan berkas baru harus mengikuti tata kelola folder Astro yang sudah berjalan (dikategorikan per fitur/laman di dalam `src/pages/` atau `src/components/`). Jangan membuat berkas layout atau utilitas baru yang tumpang tindih dengan fungsi lama.

---

## 3. USER HIERARCHY & ROUTE INTERCEPTORS (ACCESS CONTROL)
Sistem memiliki 4 tingkat otentikasi di sisi client yang dikontrol via Vanilla JS (memanfaatkan `localStorage` atau token state untuk kebutuhan penataan tampilan UI):

* **Guest (Belum Login):** * *Hak Akses:* Laman Home, Layanan, dan About Us.
  * *Pencegatan (Interception):* Jika Guest mencoba mengisi data pemesanan pada form layanan, mengklik rute untuk melihat jadwal, atau memilih *card* armada pada halaman booking, intersep aksinya via Vanilla JS DOM event dan lakukan *redirect* otomatis ke `/login`.
* **Customer (Sudah Login):** * *UI State:* Navbar otomatis menyembunyikan opsi "Login" dan menampilkan tautan menu **"Riwayat Pesanan"**.
  * Berhak menyelesaikan form booking hingga diarahkan ke halaman opsi pembayaran (`Cash` & `Cashless`).
* **Supir (Sub-Admin / Tingkat Rendah):**
  * Isolasi penuh. Hanya bisa melihat layout/panel khusus supir di dalam direktori `src/pages/driver/` yang menggunakan `DriverLayout.astro`.
  * Dicegah (di-*redirect*) jika mencoba masuk ke halaman admin utama (owner) atau halaman booking umum customer.
* **Admin (Owner):** * Akses penuh ke semua halaman panel kontrol dashboard, visualisasi laporan finansial, manajemen visual tata letak konten, dan verifikasi antarmuka pengeluaran.

---

## 4. DETAILED FEATURE SPECIFICATIONS (FRONT-END SCOPE)

### A. Modul Customer & Penjadwalan Dinamis (Laman Layanan -> Rute)
1. **Logika Jadwal Dinamis (Vanilla JS Display Only):** Komponen visual jadwal lama tidak boleh diubah susunan CSS/HTML-nya. Data pilihan tanggal di dalamnya wajib di-generate otomatis oleh Vanilla JS berdasarkan objek `new Date()` dengan rentang **14 hari ke depan**, dengan aturan filter tampilan rute:
    * **Rute Panawangan - Jakarta:** Hanya memunculkan pilihan tanggal yang jatuh pada hari **Senin, Rabu, dan Jumat**.
    * **Rute Jakarta - Panawangan:** Hanya memunculkan pilihan tanggal yang jatuh pada hari **Selasa, Kamis, dan Minggu**.
2. **Form Travel Regular:** Menggunakan pola `inputGroup` untuk input Rute, Jadwal dinamis (sesuai aturan di atas), visual grid selector Kursi, Barang Bawaan (opsional), serta Alamat Penjemputan & Penurunan.
3. **Form Travel Charter:** Form Pilih Armada (card selector), Tanggal Berangkat & Kembali, Area Tujuan, dan Alamat Lokasi.
4. **Form Paket (Logistik):** Form input data pengirim/penerima, berat (kg), dan dimensi. Tambahkan validasi client-side: jika input dimensi/berat melebihi ambang batas standar, render komponen Tailwind banner peringatan `Double Charge Notice` secara dinamis sebelum tombol submit dapat ditekan.
5. **Status Stepper Riwayat:** Visualisasi riwayat pemesanan menggunakan variasi komponen `badge` dengan alur stepper visual: `Menunggu Konfirmasi` $\rightarrow$ `Pembayaran (Cash/Cashless)` $\rightarrow$ `Selesai`.

### B. Modul Admin Dashboard & Konten Visual
1. **Dashboard Analytics Cards:** Komponen stat card penampung data visual dari API payload (Pendapatan Hari Ini, Jumlah Pengguna, Total Supir, Pemesanan Hari Ini/Bulan Ini, Pendapatan per Armada).
2. **Datatable Pemesanan:** Baris data manifes dilengkapi tombol aksi UI `Terima`/`Tolak` dan komponen modal alokasi armada, kolom input parameter harga (untuk dikirim ke API), kolom ETA, dan pilihan Supir 1 & Supir 2.
3. **Datatable Paket:** Tampilan logistik dengan deteksi otomatis jika data objek bernilai 'Super Besar', maka render komponen badge `Memakan 2 Kursi`.
4. **Kelola Konten & Promo Sync:** Form input untuk Promo Home dan Promo Layanan (Tagline, Paragraf, Gambar, Besaran Promo, Badge) terintegrasi satu payload agar struktur data sinkron saat dikirim ke API server.
5. **Kelola Armada (Maintenance Toggle):** Tombol switch Tailwind untuk mengubah status visual armada. Jika diset `Maintenance`, Vanilla JS mengirim perintah state ke server dan secara dinamis menyembunyikan mobil tersebut dari display pilihan customer.
6. **Laporan Keuangan & Pengeluaran UI View:**
    * Komponen filter tombol: `Mingguan`, `Bulanan`, `Tahunan` (mengirim query parameter ke API dan merender ulang data tabel transaksi terbaru).
    * Tombol aksi visual `ACC/Verifikasi` pada baris laporan nota pengeluaran supir.
    * **Tampilan Visual Jadwal:** Menampilkan output visual penjadwalan bayar berikutnya berdasarkan respon server untuk Travel NIB (+5 tahun ke depan) dan Pajak Kendaraan (+1 tahun).
    * **Informasi Gaji Supir:** Hanya menampilkan teks info/komponen visual statis penanda alokasi komisi gaji supir (misal: "Indikator: Komponen Gaji Supir 40% dari pendapatan armada"). **Dilarang keras menuliskan logika perkalian matematika finansial di dalam kode.**

### C. Modul Supir Interface (Mobile-First Layout)
Dibangun menggunakan standar desain komponen lama di bawah direktori `src/pages/driver/`:
1. **Manifest Penumpang View:** Tampilan berbasis list/accordion Tailwind untuk mengecek daftar nama penumpang, rute, dan alamat penjemputan/penurunan.
2. **Form Biaya Perjalanan:** Input biaya operasional tak terduga menggunakan `inputGroup` dilengkapi dengan komponen *file selector* untuk unggah foto nota (State awal UI: *Pending Admin Approval*).
3. **Form Input Maintenance:** Form laporan kerusakan teknis armada ke antrean verifikasi admin.
4. **Package Timeline Stepper:** Indikator visual status paket (`Menunggu` $\rightarrow$ `Dalam Perjalanan` $\rightarrow$ `Sampai Tujuan`). Validasi Vanilla JS wajib mengunci tombol *step* akhir dan mewajibkan aktivasi kamera atau unggahan gambar bukti kirim sebelum status dapat diubah ke `Sampai Tujuan`.

---

## 5. AUTOMATED WORKFLOW FOR AI EXECUTION
Setiap kali diperintahkan melakukan update, perbaikan bug, atau penambahan fitur baru, AI wajib mengikuti urutan kerja ketat di bawah ini secara runut:

1. **[CRITICAL - STEP 1] GLOBAL PATH MAPPING:** * Lakukan pemetaan menyeluruh (*recursively scan*) terhadap semua file di dalam folder `src/`.
   * Deteksi seluruh baris `import` pada file `.astro`, `.js`, dan `.ts`. Jika ditemukan perhitungan kedalaman path yang salah (seperti salah jumlah tanda `../` atau ekstensi file yang hilang), hitung ulang jarak direktori secara matematis berdasarkan peta global dan perbaiki langsung di tempat agar proyek terbebas dari error *FailedToLoadModuleSSR*.
2. **[STEP 2] CORE BOUNDARY CHECK (FRONT-END VALIDATION):** * Evaluasi instruksi fitur yang masuk. Pastikan kode yang akan ditulis **TIDAK MENGANDUNG** fungsi kalkulasi bisnis, logika finansial, penulisan file, pembuatan rute backend/API endpoint, atau query database. 
   * Jika ada instruksi yang melintasi batas ke ranah Back End, AI wajib menolak memproses logika tersebut, mempertahankan struktur visualnya saja, dan menggunakan variabel penampung mentah (*raw props/state text*).
3. **[STEP 3] COMPONENT REUSE:** * Periksa direktori komponen internal. Wajib gunakan kembali (*reuse*) pola komponen `inputGroup` dan `badge` yang sudah tersedia sebelum memutuskan untuk membuat markup HTML atau CSS baru demi menjaga konsistensi codebase.
4. **[STEP 4] POST-RUN VERIFICATION:** * Jalankan pemeriksaan statis akhir untuk menjamin tidak ada jalur import baru yang patah, tag HTML yang tidak tertutup, atau layout utilitas Tailwind CSS yang rusak akibat penambahan modul baru.