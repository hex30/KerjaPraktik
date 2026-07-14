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
        const groupedTravel: { [code: string]: any[] } = {};
        travelRes.value.data.forEach((item: any) => {
          const code = item.booking_code || item.booking_id || item.id || 'N/A';
          if (!groupedTravel[code]) {
            groupedTravel[code] = [];
          }
          groupedTravel[code].push(item);
        });

        Object.keys(groupedTravel).forEach((code) => {
          const items = groupedTravel[code];
          const first = items[0];
          
          const totalPrice = items.reduce((sum, it) => sum + parseFloat(it.price || 0), 0);
          const totalOriginalPrice = items.reduce((sum, it) => sum + parseFloat(it.original_price || it.price || 0), 0);
          const seats = items.map(it => it.seat_number).sort((a, b) => a - b).join(', ');
          const totalExtraCharge = items.reduce((sum, it) => sum + (it.is_baggage_charge ? 250000 : 0), 0);
          
          mergedHistory.push({
            id: first.booking_id || first.id || 'N/A', // Tetap gunakan UUID pertama untuk panggilan API
            type: 'travel',
            title: `Perjalanan Rute: ${first.route_name || 'Reguler'}`,
            date: first.departure_date || first.created_at || new Date().toISOString(),
            price: totalPrice,
            original_price: totalOriginalPrice,
            status: first.booking_status || first.status || 'PENDING',
            meta: {
              booking_code: code !== 'N/A' && code.startsWith('TRV') ? code : undefined,
              seat_number: seats,
              payment_method: first.payment_method,
              payment_proof_url: first.payment_proof_url,
              is_group: items.length > 1,
              passenger_names: items.map(it => it.passenger_name || 'Penumpang').join(', '),
              extra_charge: totalExtraCharge,
              bookings: items, // array mentah
              ...first
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
            price: item.offered_price ? Number(item.offered_price) : 0,
            original_price: item.original_price ? Number(item.original_price) : undefined,
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
            price: item.original_price ? (Number(item.original_price) - Number(item.discount_amount || 0)) : 0,
            original_price: item.original_price ? Number(item.original_price) : undefined,
            status: (['dibatalkan', 'ditolak', 'REJECTED', 'selesai', 'COMPLETED'].includes(item.status)) ? item.status : ((item.transaction_status === 'menunggu_pembayaran' || item.transaction_status === 'menunggu_konfirmasi') ? item.transaction_status : (item.status || 'PENDING')),
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

  async updatePaymentMethod(orderId: string, type: 'travel' | 'charter' | 'package', method: 'cash' | 'cashless'): Promise<any> {
    let endpoint = '';
    if (type === 'travel') {
      endpoint = `/api/travel/bookings/${orderId}/payment-method`;
    } else if (type === 'package') {
      endpoint = `/api/packages/bookings/${orderId}/payment-method`;
    } else {
      endpoint = `/api/charter/request/${orderId}/payment-method`;
    }
    
    return apiFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ payment_method: method })
    });
  }
};
