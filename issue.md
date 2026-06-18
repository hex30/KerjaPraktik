# Daftar Bug & Issue (Known Issues)

Berikut adalah daftar kendala antarmuka (UI) dan fungsionalitas yang masih teridentifikasi dan memerlukan perbaikan pada tahap berikutnya:

## 🚨 Prioritas Tinggi (Layout & Responsivitas)
1.  **Admin Content Card:** Kartu pratinjau konten pada halaman kelola konten admin belum sepenuhnya responsif di layar kecil (terjadi *overflow*).
2.  **Manajemen Armada (Mobile):** Grid armada pada perangkat mobile masih menampilkan lebih dari 1 kolom, seharusnya tampil 1 card per baris untuk kejelasan informasi.
3.  **Manajemen Destinasi (Mobile):** Grid destinasi favorit pada panel admin belum optimal untuk layar kecil (seharusnya tampil 1 card per baris).
4.  **Tombol Kontrol Armada:** Tombol aksi untuk "Tampilkan/Sembunyikan Sisa Armada" pada laman Admin Fleet menghilang atau tidak muncul pada beberapa resolusi layar tertentu.
5.  **User Destination Detail:** Layouting pada bagian detail destinasi favorit (setelah diklik) masih berantakan (*bad layouting*) dan tidak presisi sesuai referensi desain terbaru.

## 🛠️ Tugas Perbaikan Selanjutnya
-   [ ] Optimasi grid system menggunakan `grid-cols-1` pada breakpoint mobile untuk seluruh panel admin.
-   [ ] Perbaikan logika `hidden/block` pada tombol ekspansi armada.
-   [ ] Redesign komponen `DestinationDetail.astro` agar presisi 1:1 dengan wadah desain yang diminta.
-   [ ] Audit ulang CSS untuk elemen absolut pada komponen pratinjau promo.
