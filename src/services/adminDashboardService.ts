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
  fleet_code?: string;
  badge_label?: string;
  route?: string;
  total_passengers?: number;
  total_packages?: number;
  drivers?: string[];
  customer_name?: string;
  customer_phone?: string;
  pickup_address?: string;
  pickup_date?: string;
  return_date?: string;
  destination?: string;
  estimated_revenue?: number;
  details?: {
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
    revenue?: string | number;
  };
}

export const adminDashboardService = {
  // dokumentasi: Mengambil metrik untuk 3 card teratas
  async getDashboardMetrics(token?: string): Promise<DashboardMetrics> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await apiFetch('/api/admin/dashboard/metrics', { method: 'GET', headers });
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
  async getDepartureRequests(token?: string): Promise<DepartureRequest[]> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await apiFetch('/api/admin/dashboard/departure-requests', { method: 'GET', headers });
      return response?.data || [];
    } catch (error) {
      console.error("Endpoint departure-requests belum siap di BE:", error);
      return []; // fallback gracefully
    }
  },

  // dokumentasi: Mengambil daftar armada yang sedang bertugas (Live Status)
  async getActiveFleets(token?: string): Promise<AssignedFleet[]> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await apiFetch('/api/admin/dashboard/active-duties', { method: 'GET', headers });
      return response?.data || [];
    } catch (error) {
      console.error("Gagal mengambil active fleets:", error);
      return [];
    }
  }
};
