# PT Rini Trans Putri - Frontend AI Context Blueprint (gemini.MD)

Dokumen ini adalah instruksi terpusat dan blueprint arsitektur khusus untuk pengembangan lapisan **Front End** pada sistem informasi reservasi dan promosi PT Rini Trans Putri. Sifat dokumen ini mengikat bagi AI CLI untuk mengeksekusi, memperbaiki, atau menambahkan modul baru tanpa merusak desain sistem yang sudah ada.

## 1. PROJECT METADATA & CORE CONSTRAINTS
* **Target Project Path:** `D:\ProjekKp\KerjaPraktik\src`
* **Tech Stack Utama:** Astro Framework (`.astro`), Tailwind CSS (Utility classes), Vanilla JavaScript (ES6+ Modules).
* **Metodologi Sistem:** Component-Based Development (CBD) - Fokus pada modularitas, enkapsulasi, dan usabilitas tinggi.
* **Metodologi Desain:** Design Thinking - Fokus pada kejelasan status, kemudahan navigasi, dan fungsionalitas intuitif.

### ⚠️ BATASAN RUANG LINGKUP MUTLAK (FRONT END ONLY)
1. **Dilarang Keras Mencampur Logika Bisnis:** Front End tidak boleh melakukan operasi matematika bisnis atau kalkulasi finansial internal (misalnya: dilarang menghitung rumus gaji supir `total * 0.4` atau kalkulasi denda logistik secara manual di JavaScript client). 
2. **Data Binding & Placeholder Statis:** Semua nominal angka, tarif, dan persentase keuangan wajib diambil langsung secara mentah dari JSON payload API Back End. Jika API belum siap, Front End hanya diizinkan merender elemen teks statis (UI Placeholder) sebagai label informasi visual tanpa melakukan operasi aritmatika.
3. **Teknologi Terbatas:** Pengembangan dilarang menggunakan framework SPA eksternal (seperti React, Vue, atau Svelte). Andalkan sepenuhnya fitur bawaan komponen `.astro`, utilitas kelas Tailwind CSS, dan manipulasi DOM menggunakan Vanilla JavaScript.

---

## 2. PRE-CHECK COMPONENT REUSABILITY & CODEBASE STANDARDS
Sebelum membuat berkas baru, lakukan audit pada direktori komponen yang sudah ada:
1. **Form Input:** Wajib memakai atau mengekstensi pola komponen `inputGroup` yang sudah ada untuk semua input data form guna menjaga konsistensi UI.
2. **Status & Label:** Wajib menggunakan komponen `badge` bawaan proyek untuk menampilkan indikator status tiket, paket, atau armada.
3. **Struktur Folder:** Penempatan berkas baru harus mengikuti tata kelola folder Astro yang sudah berjalan (dikategorikan per fitur/laman di dalam `src/pages/` atau `src/components/`). Jangan membuat berkas layout atau utilitas yang tumpang tindih.

---

## 3. USER HIERARCHY & ROUTE INTERCEPTORS (ACCESS CONTROL)
Sistem memiliki 4 tingkat otentikasi di sisi client yang dikontrol via Vanilla JS (memanfaatkan `localStorage` atau token state):

* **Guest (Belum Login):** * Hak Akses: Laman Home, Layanan, dan About Us.
    * *Pencegatan (Interception):* Jika Guest mencoba mengisi data pemesanan pada form layanan, mengklik rute untuk melihat jadwal, atau memilih *card* armada pada halaman booking, intersep aksinya via Vanilla JS dan lakukan *redirect* otomatis ke `/login`.
* **Customer (Sudah Login):** * Navbar otomatis menyembunyikan opsi "Login" dan menampilkan tautan menu **"Riwayat Pesanan"**.
    * Berhak menyelesaikan form booking hingga diarahkan ke halaman opsi pembayaran (`Cash` & `Cashless`).
* **Supir (Sub-Admin / Tingkat Rendah):**
    * Isolasi penuh. Hanya bisa melihat layout/panel khusus supir di dalam direktori `src/pages/driver/` yang menggunakan `DriverLayout.astro`.
    * Dicegah (di-*redirect*) jika mencoba masuk ke halaman admin utama (owner) atau halaman booking umum customer.
* **Admin (Owner):** * Akses penuh ke semua halaman panel kontrol dashboard, visualisasi laporan finansial, verifikasi pengeluaran, dan manajemen konten.

---

## 4. DETAILED FEATURE SPECIFICATIONS (FRONT-END SCOPE)

### A. Modul Customer & Penjadwalan Dinamis (Laman Layanan -> Rute)
1. **Logika Jadwal Dinamis (Vanilla JS Display Only):** Komponen visual jadwal lama tidak boleh diubah susunan CSS/HTML-nya. Data pilihan tanggal di dalamnya wajib di-generate otomatis oleh Vanilla JS berdasarkan objek `new Date()` dengan rentang **14 hari ke depan**, dengan aturan filter tampilan rute:
    * **Rute Panawangan - Jakarta:** Hanya memunculkan pilihan tanggal yang jatuh pada hari **Senin, Rabu, dan Jumat**.
    * **Rute Jakarta - Panawangan:** Hanya memunculkan pilihan tanggal yang jatuh pada hari **Selasa, Kamis, dan Minggu**.
2. **Form Travel Regular:** Menggunakan pola `inputGroup` untuk input Rute, Jadwal dinamis (sesuai aturan di atas), visual grid selector Kursi, Barang Bawaan (opsional), serta Alamat Penjemputan & Penurunan.
3. **Form Travel Charter:** Form Pilih Armada (card selector), Tanggal Berangkat & Kembali, Area Tujuan, dan Alamat Lokasi.
4. **Form Paket (Logistik):** Form input data pengirim/penerima, berat (kg), dan dimensi. Tambahkan validasi client-side: jika input dimensi/berat melebihi ambang batas standar, render komponen Tailwind banner peringatan `Double Charge Notice` secara dinamis sebelum tombol submit dapat ditekan.
5. **Status Stepper Riwayat:** Visualisasi riwayat pemesanan menggunakan variasi komponen `badge` dengan alur stepper: `Menunggu Konfirmasi` $\rightarrow$ `Pembayaran (Cash/Cashless)` $\rightarrow$ `Selesai`.

### B. Modul Admin Dashboard & Konten visual
1. **Dashboard Analytics Cards:** Komponen stat card penampung data dari API payload (Pendapatan Hari Ini, Jumlah Pengguna, Total Supir, Pemesanan Hari Ini/Bulan Ini, Pendapatan per Armada).
2. **Datatable Pemesanan:** Baris data manifes dilengkapi tombol aksi `Terima`/`Tolak` dan komponen modal alokasi armada, kolom input parameter harga (untuk dikirim ke API), kolom ETA, dan pilihan Supir 1 & Supir 2.
3. **Datatable Paket:** Tampilan logistik dengan deteksi otomatis jika data objek bernilai 'Super Besar', maka render komponen badge `Memakan 2 Kursi`.
4. **Kelola Konten & Promo Sync:** Form input untuk Promo Home dan Promo Layanan (Tagline, Paragraf, Gambar, Besaran Promo, Badge) terintegrasi satu payload agar struktur data sinkron saat dikirim ke API server.
5. **Kelola Armada (Maintenance Toggle):** Tombol switch Tailwind untuk mengubah status armada. Jika diset `Maintenance`, Vanilla JS mengirim perintah state ke server dan secara dinamis menyembunyikan mobil tersebut dari display pilihan customer.
6. **Laporan Keuangan & Pengeluaran UI View:**
    * Komponen filter tombol: `Mingguan`, `Bulanan`, `Tahunan` (mengirim query parameter ke API dan merender ulang data tabel transaksi terbaru).
    * Tombol aksi `ACC/Verifikasi` pada baris laporan nota pengeluaran supir.
    * **Tampilan Visual Jadwal:** Menampilkan output visual penjadwalan bayar berikutnya berdasarkan respon server untuk Travel NIB (+5 tahun ke depan) dan Pajak Kendaraan (+1 tahun).
    * **Informasi Gaji Supir:** Hanya menampilkan teks info/komponen visual statis penanda alokasi komisi gaji supir (misal: "Indikator: Komponen Gaji Supir 40% dari pendapatan armada"). **Dilarang menuliskan logika perkalian matematika finansial di dalam kode.**

### C. Modul Supir Interface (Mobile-First Layout)
Dibangun menggunakan standar desain komponen lama di bawah direktori `src/pages/driver/`:
1. **Manifest Penumpang View:** Tampilan berbasis list/accordion Tailwind untuk mengecek daftar nama penumpang, rute, dan alamat penjemputan/penurunan.
2. **Form Biaya Perjalanan:** Input biaya operasional tak terduga menggunakan `inputGroup` dilengkapi dengan komponen *file selector* untuk unggah foto nota (State awal UI: *Pending Admin Approval*).
3. **Form Input Maintenance:** Form laporan kerusakan teknis armada ke antrean verifikasi admin.
4. **Package Timeline Stepper:** Indikator status paket (`Menunggu` $\rightarrow$ `Dalam Perjalanan` $\rightarrow$ `Sampai Tujuan`). Validasi Vanilla JS wajib mengunci tombol *step* akhir dan mewajibkan aktivasi kamera atau unggahan gambar bukti kirim sebelum status dapat diubah ke `Sampai Tujuan`.

---

## 5. AUTOMATED WORKFLOW FOR AI EXECUTION
Setiap kali diperintahkan melakukan update/fitur baru, ikuti urutan kerja wajib ini:

1. **[CRITICAL - STEP 1] GLOBAL PATH MAPPING:** * Lakukan pemetaan menyeluruh (*recursively scan*) terhadap semua file di dalam folder `src/`.
   * Deteksi seluruh baris `import` pada file `.astro`, `.js`, dan `.ts`. Jika ditemukan perhitungan kedalaman path yang salah (seperti salah jumlah tanda `../` atau ekstensi file yang hilang), hitung ulang jarak direktori secara matematis berdasarkan peta global dan perbaiki langsung di tempat agar proyek terbebas dari error *FailedToLoadModuleSSR*.
2. **[STEP 2] CORE BOUNDARY CHECK:** Pastikan kode fitur yang ditulis tidak mengandung fungsi kalkulasi bisnis, kalkulasi keuangan, atau query database. Semua data keuangan harus berupa variabel penampung mentah dari properti data.
3. **[STEP 3] COMPONENT REUSE:** Periksa dan gunakan kembali pola komponen `inputGroup` dan `badge` yang sudah tersedia sebelum memutuskan untuk membuat markup HTML baru.
4. **[STEP 4] POST-RUN VERIFICATION:** Jalankan pemeriksaan statis akhir untuk menjamin tidak ada jalur import baru yang patah atau layout Tailwind yang rusak akibat penambahan modul.