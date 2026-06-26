import { apiFetch } from './api';

export interface PackageShipmentData {
    sender_name: string;
    sender_phone: string;
    pickup_address: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    package_description: string;
    weight: number;
    dimension: 'kecil' | 'sedang' | 'besar' | 'super_besar';
    seat_qty: number;
    departure_date: string;
    payment_method?: string;
}

export const packageService = {
    // dokumentasi: Mengecek ketersediaan armada pada tanggal tertentu untuk paket
    async checkAvailability(date: string) {
        try {
            const response = await apiFetch(`/api/packages/availability?date=${date}`, {
                method: 'GET'
            });
            return response.data;
        } catch (error) {
            console.error('Error checking package availability:', error);
            throw error;
        }
    },

    // dokumentasi: Mengirim form pendaftaran paket ke backend API
    async createPackageShipment(data: PackageShipmentData) {
        try {
            // dokumentasi: Menyusun payload sesuai skema packageShipmentSchema backend
            const payload = {
                sender_name: data.sender_name,
                sender_phone: data.sender_phone,
                pickup_address: data.pickup_address,
                receiver_name: data.receiver_name,
                receiver_phone: data.receiver_phone,
                receiver_address: data.receiver_address,
                package_description: data.package_description || 'Paket Umum',
                weight: Number(data.weight),
                dimension: data.dimension,
                seat_qty: Number(data.seat_qty),
                departure_date: data.departure_date,
                ...(data.payment_method && { payment_method: data.payment_method })
            };

            // dokumentasi: Mengambil token otorisasi dari localStorage
            let headers: any = {};
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('jwt_token');
                if (token) headers['Authorization'] = `Bearer ${token}`;
            }

            // dokumentasi: Memanggil HTTP POST /api/packages/shipments
            const response = await apiFetch('/api/packages/shipments', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            return response.data || response;
        } catch (error) {
            // dokumentasi: Menangani dan mencatat error jika pengiriman gagal
            console.error('Error creating package shipment:', error);
            throw error;
        }
    }
};
