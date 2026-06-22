# Analisis & Rekomendasi Frontend (FE) Report

Setelah melakukan integrasi Backend dan Frontend (terutama memperbaiki *Crash* pada fitur Pemesanan Armada/Charter dan Upload Gambar di Admin CMS), berikut adalah laporan mengenai beberapa *pekerjaan Frontend (FE)* yang masih bisa atau perlu Anda perhatikan ke depannya dari sisi *best practice* maupun penyempurnaan fitur:

## 1. Menyelaraskan Penamaan *Property Interface* di TypeScript
Di Frontend, terdapat sedikit ketidakkonsistenan antara kontrak data (TypeScript Interface) dan komponen *Astro*.
- **Detail:** Di dalam `src/services/charterService.ts`, *interface* `Fleet` mendefinisikan atribut `price_per_day`. Namun, komponen `FleetSelectionItem.astro` memanggil variabel dengan nama `price`. 
- **Status Saat Ini:** Ini **sudah aman** karena di tingkat *Database* (Backend) saya sudah membuatkan tabel `fleets` dengan nama kolom `price`, sehingga data API akan mengirim `price` dan komponen Astro akan memprosesnya dengan benar tanpa *crash*.
- **Saran (Job FE):** Ubah tipe data `Fleet` di `charterService.ts` dari `price_per_day` menjadi `price: number;` agar *type checking* TypeScript berjalan sempurna dan tidak membingungkan *developer* lain.

## 2. Penyediaan Gambar Fallback (404 Error)
Pada *log error* terminal Anda sebelumnya, terdapat pesan error:
```
[404] /assets/images/contoh.jpg 1ms
```
- **Detail:** Saat data dari Backend tidak memiliki gambar (atau bernilai null), sepertinya Frontend mencoba menampilkan gambar bawaan (fallback) bernama `contoh.jpg`. 
- **Status Saat Ini:** Gambar ini tidak ditemukan di *folder* `public/assets/images/`.
- **Saran (Job FE):** Tambahkan sebuah gambar *placeholder* (misalnya ikon mobil abu-abu atau logo travel) dengan nama `contoh.jpg` dan letakkan di dalam folder `KerjaPraktik/public/assets/images/`. Ini penting agar tampilan UI tidak terlihat *broken/error image* ketika pengguna membuka aplikasi.

## 3. Validasi *Upload File* Ukuran Besar
- **Detail:** Di Admin CMS, pengguna dapat mengunggah gambar promosi atau destinasi. 
- **Saran (Job FE):** Tambahkan batasan maksimal ukuran *file* (contoh: 2MB) langsung pada tag `<input type="file" />` menggunakan atribut HTML atau validasi *JavaScript* sebelum *submit*. Meskipun Backend sudah membatasi (max 5MB), memblokir *file* besar lebih awal di Frontend akan memberikan *User Experience* yang lebih responsif karena *user* tidak perlu menunggu proses *upload* yang lama hanya untuk ditolak oleh *server*.

---

### Kesimpulan
Perbaikan utama dan *crash* aplikasi sudah **selesai ditangani** dengan kolaborasi *Backend Fixes* (menambah kolom database) dan penghapusan *Bug Header API Fetch*. Saran-saran di atas bersifat *minor* dan dapat Anda kerjakan sambil jalan untuk menyempurnakan kualitas kode Frontend Anda!
