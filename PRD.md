# PRODUCT REQUIREMENT DOCUMENT (PRD.md)
## Pengembangan Fitur & Optimasi Antarmuka UI/UX Responsif — PT Rini Trans Putri

Dokumen ini mendefinisikan ruang lingkup teknis implementasi fungsionalitas *front-end* menggunakan Astro, Tailwind CSS, dan Vanilla JavaScript. Seluruh penambahan wajib menerapkan prinsip **Mobile-First** secara asli menggunakan utility classes Tailwind CSS tanpa merusak kestabilan tata letak yang sudah ada.

---

## 1. FORM INPUT ALAMAT PENURUNAN (ALAMAT AKHIR) - SISI PENGGUNA

### 📋 Deskripsi Fitur
Menambahkan form pengisian alamat akhir/penurunan bagi pengguna saat melakukan pemesanan tiket reguler tepat setelah pemilihan tanggal keberangkatan.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
* **Penempatan:** Sisipkan di bawah komponen pemilihan tanggal (Merujuk pada `image_d41632.png`).
* **Struktur Grid Komponen:** 
  * Gunakan template komponen `@ui/InputGroup`.
  * **Mobile:** Diatur vertikal penuh menggunakan `grid grid-cols-1 gap-4`.
  * **Desktop (`md:`):** Bertransisi menjadi multi-kolom menggunakan `md:grid-cols-2` atau `md:grid-cols-3` untuk menghemat ruang vertikal layar.
* **Atribut Form:** Field mencakup Kecamatan, Desa, Dusun, RT/RW, dan Patokan (Tanpa field Nama Lengkap).

---

## 2. METADATA ALAMAT TUJUAN (END) DATA PEMESAN REGULER - SISI ADMIN

### 📋 Deskripsi Fitur
Menampilkan visualisasi data alamat penurunan terstruktur hasil input pengguna pada panel ringkasan detail transaksi admin.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
* **Penempatan:** Dirender pada blok kontainer **ALAMAT TUJUAN (END)** di komponen Detail Alamat Jemput & Tujuan (Merujuk pada `image_d419bb.png`).
* **Struktur Layout:**
  * Gunakan padding yang aman di semua perangkat (`p-4 md:p-6`).
  * Teks patokan menggunakan penekanan tebal (`font-bold text-slate-900 dynamic-text-class`).

---

## 3. DETAIL ALAMAT TUJUAN (END) PADA BOOKING CHARTER - SISI ADMIN

### 📋 Deskripsi Fitur
Menampilkan informasi lokasi akhir penyewaan armada (Charter) yang hanya memuat area/kota tujuan utama.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
* **Penempatan:** Bagian kiri bawah pada card detail pemesanan charter admin (Merujuk pada `image_d428fa.png`).
* **Struktur Teks:** Teks dibuat ringkas dan bersih. Gunakan utilitas responsif seperti `text-sm md:text-base` untuk memastikan keterbacaan teks kota tetap optimal di layar sekecil apa pun.

---

## 4. EXPANDABLE GRID KELOLA ARMADA (WORKSPACE ADMIN)

### 📋 Deskripsi Fitur
Optimasi tampilan daftar armada pada submenu Kelola Armada khusus untuk perangkat seluler menggunakan mekanisme *toggle expandable*.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
* **Perilaku Grid Layar:**
  * **Mobile (`max-width: 768px`):** Grid default diatur ke `grid grid-cols-1`. Secara default, hanya kartu pertama yang memiliki kelas `block`, sementara kartu ke-2 dan seterusnya diberikan kelas `hidden` secara otomatis.
  * **Desktop (`md:`):** Grid otomatis berubah menjadi `md:grid-cols-2 lg:grid-cols-3`, dan kelas `hidden` pada sisa kartu dilepas secara permanen (`md:block`).
* **Interaksi Kontrol (Vanilla JS):** Tombol CTA *"Tampilkan Armada"* hanya muncul di viewport mobile (`block md:hidden`). Saat diklik, JavaScript akan melakukan toggle kelas `hidden` pada sisa kartu dan mengubah teks CTA secara dinamis.

---

## 5. EXPANDABLE GRID KELOLA DESTINASI (WORKSPACE ADMIN)

### 📋 Deskripsi Fitur
Penerapan sistem *expand-collapse* kartu galeri destinasi wisata pada resolusi mobile untuk mencegah *scrolling* yang terlalu panjang.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
* **Perilaku Grid Layar:**
  * **Mobile:** Tampilan diatur `grid grid-cols-1`. Hanya merender 1 kartu destinasi utama, sisa kartu diisolasikan menggunakan utilitas class `hidden`.
  * **Desktop (`md:`):** Mengikuti layout baku sebelumnya yaitu grid 4x1 (`md:grid-cols-2 lg:grid-cols-4`), dengan kondisi seluruh kartu ditampilkan tanpa penyembunyian (`md:block`).
* **Interaksi Kontrol:** Tombol toggle menggunakan kelas `w-full md:hidden` untuk memastikan tombol memenuhi lebar layar di mobile dan menghilang di desktop.

---

## 6. SUBMENU BARU: KELOLA DAFTAR PENGGUNA & INTERAKSI KARTU MUTASI ROLE

### 📋 Deskripsi Fitur
Penambahan menu navigasi baru untuk mengelola akun pengguna (Customer) dan pengemudi (Driver) dalam bentuk layout kartu modern.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
* **Navigasi Sidebar:** Tambahkan tautan induk menggunakan komponen `@ui/NavLink` yang fleksibel dengan sub-menu akordion: "Pengguna" dan "Driver".
* **Arsitektur Grid Dashboard Akun:**
  * Tata letak grid kartu bersifat adaptif: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.
* **Desain Kartu Akun Modern:** 
  * Gunakan kelas Tailwind: `bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between transition-all hover:shadow-md`.
  * Sediakan input *Password* dan *Role* yang dapat diedit (`bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary`). Data profil lainnya diatur menjadi *read-only*.
* **Mekanisme Checkbox Elevasi Role:** Tambahkan komponen checkbox modern di sudut kartu. Jika dicentang, manipulasi DOM JavaScript akan memindahkan elemen kartu ini dari view grup Pengguna ke view grup Driver secara reaktif.

---

## 7. RESTRUKTURISASI RESPONSIVITAS KARTU PESANAN & DATA PAKET (MOBILE VIEW)

### 📋 Deskripsi Fitur
Perombakan total anatomi susunan informasi kartu pesanan (Rute & Booking) serta data paket logistik agar proporsional saat dibuka via HP.

### 📐 Spesifikasi Responsif & Tata Letak Tailwind
Terapkan utility kelas terstruktur berikut pada komponen kartu:
* **Kontainer Utama:** `flex flex-col md:flex-row justify-between p-4 md:p-6 w-full`
* **Blok Header & Informasi (Kiri Atas):** 
  * Bungkus Nama Pemesan dan Detail Perjalanan ke dalam satu divisi (`flex flex-col gap-1`). 
  * Posisi Detail Perjalanan berada tepat di bawah nama pemesan.
* **Blok Status & Aksi (Kanan):**
  * **Mobile:** Atur menggunakan `flex flex-row justify-between items-center mt-4 pt-4 border-t border-slate-100 w-full md:mt-0 md:pt-0 md:border-0 md:w-auto md:flex-col md:justify-between md:items-end`.
  * Komponen *Status* berada di atas dan *Tombol Aksi* (Kelola & Detail) berada di bawah.
* **Konten Dropdown Terbuka (Saat Kartu Diklik di Mobile):**
  * Detail Alamat Jemput (START) dan Alamat Tujuan (END) tersusun vertikal penuh (`flex flex-col gap-3 mt-4`). Alamat Tujuan diletakkan tepat di bawah Alamat Jemput.
  * Blok Alokasi Armada & Supir dirender paling bawah di bawah detail alamat tujuan dengan pembungkus terpisah (`w-full mt-4 bg-slate-50 p-3 rounded-lg`).

---

## 8. OVERHAUL DASHBOARD UTAMA ADMIN & WORKFLOW PERSETUJUAN DRIVER

### 8.1 Grid 2xn Armada Sedang Bertugas
* **Tata Letak Grid:** 
  * **Mobile:** `grid grid-cols-1 gap-4`
  * **Desktop (`md:`):** Berubah menjadi grid dua kolom berpasangan `md:grid-cols-2 gap-6`.
* **Kontrol Expandable:** Sematkan tombol toggle di bawah grid dengan utilitas `mx-auto mt-6 px-4 py-2` untuk menampilkan/menyembunyikan sisa kartu armada bertugas secara dinamis.

### 8.2 Modul Baru: Kartu Permintaan Persetujuan Driver
* **Lokasi Penempatan:** Sisipkan tepat di atas seksi *"Daftar Armada Sedang Bertugas"* dan di bawah seksi *"Ringkasan Operasional"*.
* **Keseragaman Desain:** Karakteristik desain visual wajib identik dengan kartu armada bertugas (`bg-white rounded-xl border border-slate-200`). Atur grid agar responsif mengikuti pola `grid grid-cols-1 md:grid-cols-2`.
* **Struktur Elemen & Penggantian CTA:**
  * Tampilkan data: Driver 1 & 2, Jumlah Penumpang, Rute (`Panawangan - Jakarta` / `Jakarta - Panawangan`), Tanggal, Jumlah Paket, Nama Unit, dan Jenis Layanan.
  * Di sudut kanan bawah (posisi yang biasanya diisi oleh *Estimated Revenue*), gantikan seluruhnya dengan kontainer aksi horizontal: `flex gap-2 w-full justify-end mt-4`.
  * **Button Menyetujui:** `bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`
  * **Button Menolak:** `border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors`
* **Transisi Interaksi:** Jika tombol *Menyetujui* diklik, hapus kartu dari antrean ini via Vanilla JS dan pindahkan langsung ke dalam list komponen *"Daftar Armada Sedang Bertugas"* secara instan.