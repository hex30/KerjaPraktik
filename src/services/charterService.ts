import { apiFetch } from './api';

export interface Fleet {
    id: string;
    plate_number: string;
    car_type: string;
    seat_capacity: number;
    price_per_day: number;
    description: string;
    image_url: string;
    status: string;
}

export interface CharterRequestData {
    destination: string;
    car_type: string;
    departure_date: string;
    return_date?: string;
    pickup_address: string;
    dropoff_address?: string;
    with_driver?: boolean;
    notes?: string;
    payment_method?: string;

    // Additional passenger/pickup details from Form UI
    full_name?: string;
    sub_district?: string;
    village?: string;
    landmark?: string;
}

export const charterService = {
    // dokumentasi: Fungsi untuk mengambil katalog armada secara dinamis dari BE
    async getFleets(): Promise<Fleet[]> {
        try {
            // dokumentasi: Melakukan HTTP GET ke usulan endpoint sementara /api/content/fleets
            const response = await apiFetch('/api/content/fleets', {
                method: 'GET'
            });

            // dokumentasi: Mengembalikan array data armada jika response valid
            if (response && response.data) {
                return response.data;
            }
            return [];
        } catch (error) {
            // dokumentasi: Menangani dan mencatat error jika fetch armada gagal
            console.error('Error fetching fleets:', error);
            throw error;
        }
    },

    async checkAvailability(startDate: string, endDate: string): Promise<Record<string, boolean>> {
        try {
            const response = await apiFetch(`/api/charter/availability?start_date=${startDate}&end_date=${endDate}`, {
                method: 'GET'
            });
            if (response && response.data) {
                return response.data;
            }
            return {};
        } catch (error) {
            console.error('Error checking availability:', error);
            return {};
        }
    },

    // dokumentasi: Fungsi untuk mengirimkan data pesanan sewa charter ke BE
    async createCharterRequest(data: CharterRequestData) {
        try {
            // dokumentasi: Menyusun ulang payload menggabungkan field alamat tambahan ke dalam 'notes'
            // karena BE saat ini tidak memiliki field khusus untuk nama penumpang dan detail desa/kec.
            const payload = {
                destination: data.destination,
                car_type: data.car_type,
                departure_date: data.departure_date,
                return_date: data.return_date || data.departure_date,
                pickup_address: data.pickup_address,
                dropoff_address: data.dropoff_address || data.pickup_address,
                with_driver: data.with_driver !== undefined ? data.with_driver : true,
                ...(data.payment_method && { payment_method: data.payment_method }),
                notes: `Atas Nama: ${data.full_name || '-'}, Kec: ${data.sub_district || '-'}, Desa: ${data.village || '-'}, Patokan: ${data.landmark || '-'}. Catatan: ${data.notes || ''}`
            };

            // dokumentasi: Mengambil token untuk otorisasi endpoint charter
            let headers: any = {};
            if (typeof localStorage !== 'undefined') {
                const token = localStorage.getItem('jwt_token');
                if (token) headers['Authorization'] = `Bearer ${token}`;
            }

            // dokumentasi: Melakukan HTTP POST ke endpoint resmi /api/charter/request
            const response = await apiFetch('/api/charter/request', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            // dokumentasi: Mengembalikan data respons sukses dari backend
            return response;
        } catch (error) {
            // dokumentasi: Melemparkan error ke atas agar UI bisa menangani loading/alert
            console.error('Error creating charter request:', error);
            throw error;
        }
    }
};
