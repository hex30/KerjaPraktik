/**
 * Content Service - Integrasi Layanan Konten Publik (Banner, Destinasi, Promosi)
 */

import { apiFetch } from './api';

export const contentService = {
  // dokumentasi: Mengambil data daftar banner aktif dari endpoint /api/content/banners
  async getBanners() {
    try {
      // dokumentasi: Melakukan request GET untuk mengambil data array banner
      const response = await apiFetch('/api/content/banners', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      // dokumentasi: Menangkap error jika API gagal atau server mati
      console.error("Gagal mengambil data Banners:", error);
      throw error;
    }
  },

  // dokumentasi: Mengambil data destinasi wisata favorit dari endpoint /api/content/destinations
  async getDestinations() {
    try {
      // dokumentasi: Melakukan request GET untuk mengambil data array destinasi
      const response = await apiFetch('/api/content/destinations', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      // dokumentasi: Menangkap error jaringan atau server
      console.error("Gagal mengambil data Destinations:", error);
      throw error;
    }
  },

  // dokumentasi: Mengambil data promo global yang sedang aktif (digunakan di Home & Layanan)
  async getPromotions(type?: string) {
    try {
      const endpoint = type ? `/api/content/promotions?type=${type}` : '/api/content/promotions';
      const response = await apiFetch(endpoint, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error("Gagal mengambil data Promotions:", error);
      throw error;
    }
  }
};
