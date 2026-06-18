# PT Rini Trans Putri - Frontend AI Context Blueprint (gemini.md)

Dokumen ini adalah instruksi terpusat, aturan baku, dan blueprint arsitektur khusus untuk pengembangan lapisan **Front End UI/UX** pada sistem informasi reservasi dan promosi PT Rini Trans Putri. Sifat dokumen ini mengikat dan wajib dipatuhi secara mutlak oleh AI CLI dalam mengeksekusi, memperbaiki, merombak, atau menambahkan modul baru tanpa merusak stabilitas desain sistem yang sudah ada.

## 1. PROJECT METADATA & CORE CONSTRAINTS
* **Target Project Path:** `D:\ProjekKp\KerjaPraktik\src`
* **Tech Stack Utama (MUTLAK):** Astro Framework (`.astro` components), Tailwind CSS (Utility classes), Vanilla JavaScript (ES6+ Modules untuk Client-Side DOM manipulation).
* **Metodologi Sistem:** Component-Based Development (CBD) - Fokus pada modularitas, enkapsulasi komponen, dan tingkat usabilitas UI yang tinggi.
* **Metodologi Desain:** Design Thinking - Fokus pada kejelasan status visual, kemudahan navigasi antar halaman, dan fungsionalitas antarmuka yang intuitif.
* **Peran Eksklusif AI:** AI bertindak murni sebagai **Pure Front-End Developer Agent**. AI tidak memiliki otoritas, hak akses, ataupun izin untuk menyentuh, memodifikasi, atau merancang arsitektur Back End.

### ⚠️ BATASAN RUANG LINGKUP MUTLAK (FRONT END ONLY)
1. **Dilarang Keras Mencampur dan Menulis Logika Bisnis (No Business Logic):** Front End dilarang melakukan kalkulasi data matematis internal, rumus keuangan, algoritma penggajian, pemrosesan diskon secara sepihak, ataupun penentuan denda logistik di sisi client (misalnya: dilarang menulis fungsi perkalian `total * 0.4` untuk komisi supir di JavaScript). 
2. **Data Binding & Placeholder Statis:** Semua nominal angka, tarif, status operasional, dan persentase keuangan wajib diterima secara pasif dalam bentuk variabel mentah (*raw text/payload object string*) dari API Back End. Jika API belum siap, Front End hanya diizinkan merender elemen teks statis (UI Mockup/Placeholder).
3. **Teknologi Terbatas & Steril:** Dilarang menggunakan framework SPA eksternal (seperti React, Vue, Svelte, atau Angular). Andalkan sepenuhnya `.astro`, Tailwind CSS, dan Vanilla JavaScript murni.
4. **Larangan Operasi Back End:** AI dilarang keras menulis query database, membuat endpoint API baru, mengatur session/cookies server, atau mengelola fungsi write ke *file system* di sisi server.

---

## 2. AUTONOMOUS PATH ALIASES CONFIGURATION & REFACTORING
AI CLI tidak boleh mengasumsikan alias sudah ada. Sebelum melakukan pekerjaan apa pun, AI CLI **wajib** melakukan inisialisasi berikut:

1. **Pemindaian Direktori (Directory Scan):** Lakukan pemindaian rekursif pada direktori `src/` untuk mengidentifikasi semua folder arsitektur utama (contoh: `components`, `features`, `ui`, `layouts`, `pages`, `utils`, `services`, dll).
2. **Pembuatan Config Dinamis:** Berdasarkan folder yang ditemukan, buat atau perbarui file `tsconfig.json` di *root* proyek. Petakan objek `"paths"` secara presisi (contoh: `@ui/*: ["src/components/ui/*"]`).
3. **Refaktor Rute Global:** Setelah `tsconfig.json` valid, pindai seluruh file `.astro`, `.ts`, dan `.js`. Hapus seluruh impor relatif tradisional (seperti `../../../`) dan ganti dengan *Astro Path Aliases* yang baru dibuat. Pastikan kompilasi terbebas dari error `FailedToLoadModuleSSR`.

---

## 3. DYNAMIC REUSABLE COMPONENT DISCOVERY & INVENTORY
Sistem tidak hanya bergantung pada `inputGroup` dan `badge`. AI CLI diwajibkan untuk **menganalisis seluruh basis kode**, mengidentifikasi komponen yang dapat digunakan ulang (reusable), dan memprioritaskan penggunaannya daripada membangun elemen dari awal.

* **Tugas Audit CLI:** Pindai folder `src/components/`, `src/layouts/`, dan `src/ui/`.
* **Inventarisasi:** Kenali komponen tata letak (seperti `AdminLayout`, `DriverLayout`), komponen form, tombol, kartu, tabel, dan utilitas visual lainnya.
* **Self-Update:** AI CLI memiliki izin penuh untuk **memperbarui bagian ini (Bagian 3) pada file `gemini.md`** secara otomatis dengan mendaftarkan komponen reusable baru yang ia temukan selama fase pemindaian.

*(AI CLI: Tulis/Update daftar komponen reusable yang Anda temukan di bawah baris ini setelah pemindaian).*
**[DAFTAR KOMPONEN REUSABLE TERDETEKSI]**
* `InputGroup`: Standarisasi untuk input form.
* `Badge`: Indikator status tiket, paket, atau armada.
* `AdminBadge`: Indikator status khusus admin.
* `Button`: Standarisasi tombol aksi utama.
* `FAQ` & `FAQItem`: Akordion untuk FAQ.
* `HeroAside`: Komponen gambar di sisi form booking.
* `NavLink`: Tautan menu navigasi.
* `QuantitySelector`: Input penambah/pengurang jumlah barang.
* `RadioCard`: Komponen pilihan radio button berdesain kartu.
* `SectionHeader`: Header dengan judul dan subjudul untuk seksi konten.
* `MainLayout`, `AdminLayout`, `DriverLayout`: Komponen tata letak struktur halaman.

---

## 4. USER HIERARCHY & ROUTE INTERCEPTORS (ACCESS CONTROL)
Sistem memiliki 4 tingkat otentikasi di sisi client via Vanilla JS (menggunakan `localStorage`/token state):

* **Guest (Belum Login):** * *Hak Akses:* Bebas mengakses, mengklik, navigasi, melihat jadwal dinamis, meninjau alternatif rute, serta memeriksa pilihan armada aktif pada Laman Home, Layanan, dan About Us.
  * *Pencegatan (Interception):* Aturan intersep login **hanya berlaku eksklusif pada pengisian form dan interaksi data pemesanan**. Jika Guest mencoba mengisi form layanan, mengklik petak kursi, atau menekan tombol submit order, lakukan *redirect* ke `/login`.
* **Customer (Sudah Login):** * Navbar menyembunyikan "Login" dan menampilkan **"Riwayat Pesanan"**.
  * Berhak menyelesaikan form booking hingga halaman opsi pembayaran (`Cash` & `Cashless`).
* **Supir (Sub-Admin / Tingkat Rendah):**
  * Isolasi penuh pada layout khusus di dalam `src/pages/driver/`.
  * Di-*redirect* jika mencoba masuk ke halaman admin utama atau booking customer.
* **Admin (Owner):** * Akses penuh ke dashboard, visualisasi laporan finansial, kelola konten, dan verifikasi pengeluaran.

---

## 5. DETAILED FEATURE SPECIFICATIONS (FRONT-END SCOPE)

### 1. Modul Detail Destinasi Favorit (Desain Bulat Sempurna)
* **Keliling Lingkaran:** Wadah gambar destinasi menjadi bulat sempurna (`rounded-full`), proporsional dengan tinggi kotak pembungkus putih. Tambahkan border tebal gelap (misal: `border-[6px] border-[#0e4e5e]`).
* **Pembungkus Putih:** Sisi kiri harus memiliki lekukan radial yang melengkung mulus mengikuti kontur lingkaran gambar. Sisi kanan menggunakan lengkungan modern (`rounded-xl`).
* **Tag Lokasi:** Label `PANGANDARAN, INDONESIA` menempel rapi di bawah bingkai bulat gambar.
* **CTA Navigasi Kembali:** Ganti teks tautan lama dengan ikon panah kiri (*arrow-left*) di dalam lingkaran putih kecil, melayang menempel pada sudut kiri atas lingkaran gambar utama.

### 1.1 Modul Sinkronisasi Promosi Laman Layanan
* Tampilkan **Tagline** dan **Nominal/Persentase Diskon** secara jelas (dari *Home Page Promotion payload*).
* Sembunyikan deskripsi panjang dan komponen *badge* status internal.

### 2. Overhaul Dashboard Admin & Ringkasan Operasional Armada
* Hapus kartu "Pendapatan per armada" dan visualisasi "Statistik pendapatan bulanan".
* Ganti dengan section **"Daftar Armada Sedang Bertugas"** (Render bersyarat):
  * **Template "Rute":** Tampilkan badge layanan, rute perjalanan, total penumpang, total paket, nama supir, dan teks statis estimasi pendapatan.
  * **Template "Booking":** Tampilkan badge layanan, nama pemesan, nomor telepon, alamat jemput/tujuan, tanggal (berangkat/pulang), nama supir, dan teks statis estimasi sewa.

### 3. Data Pemesan & Form Rute Regular
* Set default value harga menjadi **"250.000"**.
* Input harus dapat diubah (*editable*) oleh admin sebelum disimpan ke *state*.

### 4. Kelola Konten & Promo Workspace
* Hapus manajemen "Destinasi Favorit" dari menu "Kelola Promosi".
* Biarkan kotak *Preview* promosi melebar (*auto-scale*) mengisi sisa ruang secara responsif.

### 5. Kelola Konten Submenu Kelola Armada
* **Expandable Grid:** Tambah tombol "Tampilkan Sisa Armada" untuk *toggle* kartu armada menggunakan DOM Vanilla JS.
* **Dropdown Relocation:** Pindahkan status armada (Tersedia, Dalam Pemeliharaan, Sedang Disewa) ke dalam **Form Edit Armada**.
* **Client-Side Card Deletion:** Pasang ikon *trash bin* berdampingan dengan ikon pena. Eksekusi simulasi hapus dari tampilan visual lokal via Vanilla JS.

### 6. Submenu Independen: Kelola Destinasi
* **Grid 4x1:** Susun ulang kartu destinasi sebelumnya ke grid 4x1. Sertakan tombol "Tampilkan Sisa Destinasi".
* **Form Tambah:** Gunakan kembali komponen `InputGroup` untuk Gambar, Nama Lokasi, Lokasi Daerah, dan Deskripsi.
* **Auto-Populate Mode:** Klik ikon pena pada kartu akan mengisi form di bawahnya secara otomatis (*auto-populate*) dengan data terkait untuk masuk ke mode edit.

### 7. Form Masukan Data Pengeluaran
* Tambahkan menu "Masukan Data Pengeluaran" di sidebar laporan keuangan.
* Gunakan `InputGroup` untuk: Dropdown Jenis Pengeluaran, Penanggung Jawab, Date Picker Tanggal, Nominal (Mata uang), Bukti File, dan Detail Teks.
* **UI Reactive Binding:** Submit form ini harus mensimulasikan pembaruan baris data visual pada tabel laporan keuangan.

---

## 6. AUTOMATED WORKFLOW FOR AI EXECUTION
AI wajib menjalankan urutan ini setiap kali diberi instruksi eksekusi:

1. **[INTELLIGENCE INIT - PATH & COMPONENTS]:** Lakukan pemindaian direktori secara diam-diam. Buat konfigurasi path alias dinamis di `tsconfig.json`. Refaktor jalur *import* file secara mandiri. Lakukan identifikasi komponen *reusable* dan simpan *state* memori ke dalam file `gemini.md` ini (pada Bagian 3).
2. **[CORE BOUNDARY CHECK]:** Evaluasi instruksi masuk. Tolak keras pembuatan logika bisnis (Backend). Jika melanggar, ubah permintaan pengguna menjadi render *placeholder text* secara pasif.
3. **[EXECUTION via REUSE]:** Tulis kode UI/UX dengan memprioritaskan penggunaan komponen yang ditemukan pada tahap inisialisasi. Jangan membuat utilitas atau tag mentah jika komponennya sudah ada.
4. **[VERIFICATION]:** Kompilasi kode secara logis. Periksa patahan tautan, *HTML unclosed tags*, dan keretakan Tailwind. Pastikan tidak ada *FailedToLoadModuleSSR*.
