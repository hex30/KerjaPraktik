# Laporan Integrasi Frontend - Backend (PT Rini Trans Putri)

## Modul Autentikasi - Halaman Login (21 Juni 2026)
- **Endpoint:** `POST /api/auth/login`
- **File Frontend Terubah:** `src/pages/auth/login.astro`, `src/services/authService.ts`, `src/services/api.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Token JWT dan data user berhasil disimpan di localStorage. Telah diimplementasikan Role-Based Access Control (RBAC) untuk mengarahkan pengguna berdasarkan role (Admin, Driver, Customer).

## Modul Autentikasi - Halaman Registrasi (21 Juni 2026)
- **Endpoint:** `POST /api/auth/register`
- **File Frontend Terubah:** `src/pages/auth/login.astro` (Register Form area), `src/services/authService.ts`
- **Status:** Selesai & Tervalidasi.
- **Catatan Integrasi:** Form pendaftaran berhasil disambungkan dengan `authService.register()`. Data pengguna yang dikirimkan melalui UI sudah terikat dan memanggil endpoint backend dengan struktur JSON yang sesuai (`name`, `email`, `password`, `phone_number`).
