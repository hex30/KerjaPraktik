import { apiFetch } from "./api";

/**
 * Service untuk menangani alur pemesanan Layanan Rute (Travel Reguler)
 */
export const travelService = {
  // dokumentasi: Mengirim daftar tanggal yang di-generate FE ke BE untuk mengecek ketersediaan kursi secara massal.
  // Endpoint BE ini mungkin belum ada (sementara), namun format request-nya sudah dipersiapkan.
  checkSchedulesAvailability: async (routeId: string, dates: string[]) => {
    try {
      const response = await apiFetch("/api/travel/schedules/availability", {
        method: "POST",
        body: JSON.stringify({ route_id: routeId, dates }),
      });
      return response;
    } catch (error) {
      console.error("Gagal memeriksa ketersediaan jadwal:", error);
      throw error;
    }
  },

  // dokumentasi: Mengambil daftar kursi yang sudah terisi berdasarkan ID jadwal.
  // Digunakan untuk merender denah kursi agar sesuai dengan status riil dari Backend.
  getSeatAvailability: async (scheduleId: string) => {
    try {
      const response = await apiFetch(`/api/travel/schedules/${scheduleId}/seats`, {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Gagal mengambil status kursi:", error);
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
};
