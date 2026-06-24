import { apiFetch } from "./api";

/**
 * Service untuk menangani alur pemesanan Layanan Rute (Travel Reguler)
 */
export const travelService = {
  // dokumentasi: Mengambil daftar rute publik dari backend
  getRoutes: async () => {
    try {
      const response = await apiFetch('/api/content/routes', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error("Gagal mengambil data rute:", error);
      return []; 
    }
  },

  // dokumentasi: Mengambil jadwal aktif dari backend sesuai kriteria pencarian
  getSchedules: async (params: { date?: string; origin?: string; destination?: string }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.date) queryParams.append('date', params.date);
      if (params.origin) queryParams.append('origin', params.origin);
      if (params.destination) queryParams.append('destination', params.destination);
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/api/travel/schedules?${queryString}` : '/api/travel/schedules';

      const response = await apiFetch(endpoint, {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Gagal mengambil jadwal travel:", error);
      throw error;
    }
  },

  // dokumentasi: Mengirimkan seluruh data booking tiket ke Backend (membutuhkan JWT Token).
  createTravelBooking: async (bookingData: any, token: string) => {
    try {
      const response = await apiFetch("/api/travel/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    } catch (error) {
      console.error("Gagal membuat pesanan travel:", error);
      throw error;
    }
  },

  // dokumentasi: Mengunggah bukti pembayaran tiket reguler (membutuhkan JWT Token).
  uploadPaymentProof: async (bookingId: string, formData: FormData, token: string) => {
    try {
      const response = await apiFetch(`/api/travel/bookings/${bookingId}/payment-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      return response;
    } catch (error) {
      console.error("Gagal unggah bukti bayar:", error);
      throw error;
    }
  },

  // dokumentasi: Cek ketersediaan jadwal 14 hari ke depan
  getSchedulesAvailability: async (routeId: string) => {
    try {
      const response = await apiFetch(`/api/travel/schedules/availability?route_id=${routeId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error("Gagal mengambil ketersediaan jadwal:", error);
      throw error;
    }
  },

  // dokumentasi: Cek okupansi kursi
  getSeatsOccupancy: async (routeId: string, date: string) => {
    try {
      const response = await apiFetch(`/api/travel/seats?route_id=${routeId}&date=${date}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error("Gagal mengecek kursi:", error);
      throw error;
    }
  },
};
