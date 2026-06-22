import { apiFetch } from './api';

export interface DashboardMetrics {
  total_bookings_today: string | number;
  total_users: string | number;
  total_drivers: string | number;
}

export interface DepartureRequest {
  id: string;
  driver1: string;
  driver2?: string;
  pax: number;
  path: string;
  date: string;
  packages: number;
  unit_name: string;
  type: string;
}

export interface AssignedFleet {
  id: string;
  name: string;
  type: string;
  details: {
    path?: string;
    pax?: number;
    packages?: number;
    drivers?: string[];
    customer?: string;
    phone?: string;
    pickup?: string;
    destination?: string;
    date_pickup?: string;
    date_return?: string;
    driver?: string;
    revenue: string;
  };
}

export const adminDashboardService = {
  // dokumentasi: Mengambil metrik untuk 3 card teratas
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await apiFetch('/api/admin/dashboard/metrics', { method: 'GET' });
      const data = response?.data || {};
      
      return {
        total_bookings_today: data.total_bookings_today || "0",
        total_users: data.total_users || "0",
        total_drivers: data.total_drivers || "0"
      };
    } catch (error) {
      console.error("Gagal mengambil metrik:", error);
      return { total_bookings_today: "0", total_users: "0", total_drivers: "0" };
    }
  },

  // dokumentasi: Mengambil antrean izin keberangkatan supir (Endpoint usulan untuk BE)
  async getDepartureRequests(): Promise<DepartureRequest[]> {
    try {
      const response = await apiFetch('/api/admin/dashboard/departure-requests', { method: 'GET' });
      return response?.data || [];
    } catch (error) {
      console.error("Endpoint departure-requests belum siap di BE:", error);
      return []; // fallback gracefully
    }
  },

  // dokumentasi: Mengambil daftar armada yang sedang bertugas (Live Status)
  async getActiveFleets(): Promise<AssignedFleet[]> {
    try {
      const response = await apiFetch('/api/admin/dashboard/active-duties', { method: 'GET' });
      return response?.data || [];
    } catch (error) {
      console.error("Gagal mengambil active fleets:", error);
      return [];
    }
  }
};
