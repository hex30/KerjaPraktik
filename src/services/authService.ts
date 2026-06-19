/**
 * Auth Service - Simulasi Logika Autentikasi
 */

// Simulasi delay jaringan (misal 1.5 detik)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

import { apiFetch } from './api';

export const authService = {
  // dokumentasi: Fungsi untuk mengirim kredensial login ke endpoint /api/auth/login
  async login(payload: any) {
    try {
      // dokumentasi: Melakukan request POST dengan payload JSON
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return response;
    } catch (error) {
      // dokumentasi: Menangkap error jaringan atau server
      console.error("Login failed:", error);
      throw error;
    }
  },

  async register(payload: any) {
    console.log("Mengirim data pendaftaran ke API...", payload);
    await delay(2000); // Simulasi proses di server

    // Simpan ke localStorage sebagai "Database Sementara"
    localStorage.setItem("dummy_user_rini_trans", JSON.stringify(payload));
    return { success: true, message: "Pendaftaran berhasil!" };
  },

  async logout() {
    await delay(500);
    localStorage.removeItem("is_logged_in");
    return { success: true };
  }
};
