import { apiFetch } from './api';

export interface UnifiedOrder {
  id: string;
  type: 'travel' | 'charter' | 'package';
  title: string;
  date: string;
  price: number;
  original_price?: number;
  status: string;
  meta: Record<string, any>;
}

export const userService = {
  // dokumentasi: Mengambil riwayat dari ketiga layanan sekaligus secara paralel
  async getUserHistory(token?: string): Promise<UnifiedOrder[]> {
    try {
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Fetching paralel agar performa halaman lebih cepat
      const [travelRes, charterRes, packageRes] = await Promise.allSettled([
        apiFetch('/api/travel/history', { method: 'GET', headers }),
        apiFetch('/api/charter/history', { method: 'GET', headers }),
        apiFetch('/api/packages/history', { method: 'GET', headers })
      ]);

      const mergedHistory: UnifiedOrder[] = [];

      // 2. Menerjemahkan respons Travel Reguler ke Skema Hibrida
      if (travelRes.status === 'fulfilled' && travelRes.value?.data) {
        travelRes.value.data.forEach((item: any) => {
          mergedHistory.push({
            id: item.booking_id || item.id || 'N/A',
            type: 'travel',
            title: `Perjalanan Rute: ${item.route_name || 'Reguler'}`,
            date: item.departure_date || item.created_at || new Date().toISOString(),
            price: item.price || item.total_price || 0,
            original_price: item.original_price || undefined,
            status: item.booking_status || item.status || 'PENDING',
            meta: {
              seat_number: item.seat_number,
              payment_method: item.payment_method,
              payment_proof_url: item.payment_proof_url,
              ...item
            }
          });
        });
      }

      // 3. Menerjemahkan respons Charter ke Skema Hibrida
      if (charterRes.status === 'fulfilled' && charterRes.value?.data) {
        charterRes.value.data.forEach((item: any) => {
          mergedHistory.push({
            id: item.id || 'N/A',
            type: 'charter',
            title: `Sewa Armada: ${item.car_type || 'Charter'}`,
            date: item.start_date || item.created_at || new Date().toISOString(),
            price: item.total_price || 0,
            original_price: item.original_price || undefined,
            status: item.status || 'PENDING',
            meta: {
              pickup_address: item.pickup_address,
              payment_proof_url: item.payment_proof_url,
              notes: item.notes,
              ...item
            }
          });
        });
      }

      // 4. Menerjemahkan respons Paket Ekspedisi ke Skema Hibrida
      if (packageRes.status === 'fulfilled' && packageRes.value?.data) {
        packageRes.value.data.forEach((item: any) => {
          mergedHistory.push({
            id: item.id || 'N/A',
            type: 'package',
            title: `Pengiriman Paket`,
            date: item.created_at || new Date().toISOString(),
            price: item.total_price || item.price || 0,
            original_price: item.original_price || undefined,
            status: item.transaction_status || item.status || 'PENDING',
            meta: {
              waybill_number: item.waybill_number,
              weight: item.weight,
              dimension: item.dimension,
              ...item
            }
          });
        });
      }

      // 5. Mengurutkan data yang telah digabung dari yang terbaru ke terlama
      mergedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return mergedHistory;
    } catch (error) {
      console.error("Gagal menarik data riwayat gabungan:", error);
      return []; // graceful degradation: kembalikan array kosong agar UI tak rusak
    }
  },

  async updatePaymentMethod(orderId: string, type: 'travel' | 'charter', method: 'cash' | 'cashless'): Promise<any> {
    const endpoint = type === 'travel' 
      ? `/api/travel/bookings/${orderId}/payment-method`
      : `/api/charter/request/${orderId}/payment-method`;
    
    return apiFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ payment_method: method })
    });
  }
};
