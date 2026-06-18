# PT Rini Trans Putri - Reservation & Promotion System

Sistem Informasi Manajemen Reservasi dan Promosi PT Rini Trans Putri dibangun menggunakan teknologi modern untuk memberikan pengalaman pemesanan tiket perjalanan dan pengiriman paket yang cepat, aman, dan intuitif.

## 🚀 Stack Teknologi
*   **Framework:** [Astro 6.0+](https://astro.build/) - Pengembangan berbasis komponen dengan performa maksimal.
*   **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) - Desain UI modern dan responsif.
*   **Runtime:** [Node.js 22+](https://nodejs.org/) - Lingkungan eksekusi sisi server yang stabil.
*   **Bahasa:** [TypeScript](https://www.typescriptlang.org/) - Keamanan tipe data untuk pemeliharaan jangka panjang.

## 🏗️ Arsitektur Proyek
Proyek ini mengikuti pola **Component-Based Development (CBD)** dengan struktur folder sebagai berikut:

```text
/
├── public/              # Aset statis publik (favicon, etc)
├── src/
│   ├── assets/          # Aset desain (images, fonts, icons)
│   ├── components/
│   │   ├── features/    # Komponen fungsional spesifik fitur (Admin, User, Driver)
│   │   ├── shared/      # Komponen global (Navbar, Footer)
│   │   └── ui/          # Komponen dasar atomik (Button, Input, Badge)
│   ├── layouts/         # Template struktur halaman utama
│   ├── pages/           # Routing halaman utama sistem
│   ├── services/        # Logika integrasi API backend
│   ├── styles/          # Konfigurasi CSS Global
│   └── utils/           # Fungsi pembantu dan pengaman (AuthGuard)
└── tsconfig.json        # Konfigurasi Path Aliases (@ui, @features, etc)
```

## 🛠️ Perintah Utama

| Command | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal |
| `npm run build` | Membangun proyek untuk tahap produksi |
| `npm run preview` | Meninjau hasil build produksi secara lokal |
| `npx astro check` | Melakukan audit statis pada sintaks dan TypeScript |

## 🔐 Tingkat Akses (User Roles)
1.  **Guest:** Mengakses info layanan, rute, dan jadwal.
2.  **Customer:** Melakukan reservasi tiket, sewa armada, dan kirim paket.
3.  **Supir:** Mengelola manifes penumpang dan laporan biaya operasional.
4.  **Admin:** Panel kendali penuh terhadap konten, armada, dan laporan keuangan.

---
© 2026 PT Rini Trans Putri. All Rights Reserved.
