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

  // dokumentasi: Fungsi untuk mengirim data pendaftaran ke endpoint /api/auth/register
  async register(payload: any) {
    try {
      // dokumentasi: Melakukan request POST dengan payload JSON
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return response;
    } catch (error) {
      // dokumentasi: Menangkap error jaringan atau server
      console.error("Registration failed:", error);
      throw error;
    }
  },

  async logout() {
    await delay(500);
    localStorage.removeItem("is_logged_in");
    return { success: true };
  }
};
