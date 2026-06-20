import { apiFetch } from "./api";

/**
 * Service untuk menangani alur pemesanan Layanan Rute (Travel Reguler)
 */
export const travelService = {
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
      // Karena mengirim FormData, tidak menggunakan apiFetch biasa yang men-set Content-Type: application/json
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL || 'http://localhost:5000'}/api/travel/bookings/${bookingId}/payment-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Gagal mengunggah bukti pembayaran:", error);
      throw error;
    }
  }
};
