import { apiFetch } from './api';

export interface DriverSchedule {
  id: string;
  fleet_id: string;
  departure_time: string;
  status: string;
  origin: string;
  destination: string;
  base_price: string | number;
  plate_number: string;
  car_type: string;
  seat_capacity: number;
  passengers: DriverPassenger[];
  packages: DriverPackage[];
}

export interface DriverPassenger {
  booking_id: string;
  seat_number: number;
  passenger_name: string;
  passenger_phone: string;
  booking_status: string;
  payment_method: string;
  price: string | number;
  pickup_address: string;
  dropoff_address: string;
}

export interface DriverPackage {
  package_id: string;
  fleet_id: string;
  waybill_number: string;
  sender_name: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  package_description: string;
  weight: number;
  dimension: string;
  original_price: string | number;
  payment_method: string;
  transaction_status: string;
  status: string;
  created_at: string;
}

export const driverService = {
  // Mengambil daftar tugas/jadwal driver beserta penumpang dan paket
  async getSchedules(token?: string): Promise<DriverSchedule[]> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await apiFetch('/api/driver/schedules', { method: 'GET', headers });
      return response?.data || [];
    } catch (error) {
      console.error("Gagal mengambil tugas driver:", error);
      return [];
    }
  },

  // Update status penumpang (booking) oleh driver
  async updatePassengerStatus(bookingId: string, status: string): Promise<any> {
    try {
      const response = await apiFetch(`/api/driver/schedules/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return response;
    } catch (error) {
      console.error("Gagal update status penumpang:", error);
      throw error;
    }
  }
};
